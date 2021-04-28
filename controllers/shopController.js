
const Shops = require('../models/shop')
const Menu = require('../models/menu')
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const { Storage } = require('@google-cloud/storage');
const stream = require('stream');
const config = require('../config/index')



exports.index = async (req, res, next) => {
   
    const shops = await Shops.find().select('name photo location').sort({_id: -1 });
   

    const shopWithPhotoDomain = await shops.map((shop,index) => {
        return {
            id : shop._id,
            name : shop.name,
            //photo : config.DOMAIN+ "/images/" + shop.photo,
            photo : config.DOMAIN_GOOGLE_STORAGE+ "/" + shop.photo,
            location : shop.location

        }
    })

    res.status(200).json({
        data : shopWithPhotoDomain
    });
  };
// get menu
  exports.menu = async (req, res, next) => {
      //populate join V.upgrate
    const menu = await Menu.find().populate('shop','name location -_id').sort('-_id')
    // const  menu = await Menu.find();

    res.status(200).json({
        data :  menu
    });
  };

  // get shop bt id with menu
  exports.getShopWithMenu = async (req, res, next) => {
  
    const { id } = req.params
    const shopWithMenu = await (await Shops.findById(id).populate('menus'))
  res.status(200).json({
      data :  shopWithMenu
  });
};


exports.insert = async (req, res, next) => {
   
    const { name , location , photo} = req.body ;

    let shop = new Shops({
        name : name ,
        location : location,
        //photo : await saveImageToDisk(photo)
        photo : await saveImageToGoogle(photo)
    }
       
    );
    await shop.save();
    res.status(201).json({
        message : "Add Shop Success"
    });
  };

  async function saveImageToDisk(baseImage) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./') ;
    //โฟลเดอร์และ path ของการอัปโหลด
    const uploadPath = `${projectPath}/public/images/`;

    //หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    //เขียนไฟล์ไปไว้ที่ path
    await writeFileAsync(uploadPath+filename, image.data, 'base64');
    //return ชื่อไฟล์ใหม่ออกไป
    return filename;
}

function decodeBase64Image(base64Str) {
    var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var image = {};
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    image.type = matches[1];
    image.data = matches[2];

    return image;
}


async function saveImageToGoogle(baseImage) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./') ;

    //หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
    

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(image.data, 'base64'));

    // Creates a client and upload to storage
    const storage = new Storage({
       projectId: '	grand-appliance-311911',
       keyFilename: `${projectPath}/google_key.json`
    });

    const myBucket = storage.bucket('node-bright');
    var myBucketFilename = myBucket.file(filename); 
    bufferStream.pipe(myBucketFilename.createWriteStream({
       gzip: true,
       contentType:  image.type,
       metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
      public: true,
      validation: "md5"
    }).on('error', (err) => {
        console.log('err =>' + err);
    }).on('finish', () => {
        console.log('upload successfully...');
    }));

    //return ชื่อไฟล์ใหม่ออกไป
    return filename;
}
