const mongoose = require('mongoose');


const schema = new mongoose.Schema({
 name : { type : String , require : true , trim : true},
 photo : { type : String , default : 'nopic.png'} ,
 location : {
    lat : Number,
    lgn : Number
 },
 
 
    },{
        toJSON : {virtuals:true},
        timestamps : true,
        collection : 'shops'
  
});


schema.virtual('menus',{
    ref : 'Menu',//link ไปที่model Menu
    localField : '_id',//_id field ของmodel Shop
    foreignField : 'shop' // field ของ model
});

const shop = mongoose.model('Shop',schema)
module.exports = shop
