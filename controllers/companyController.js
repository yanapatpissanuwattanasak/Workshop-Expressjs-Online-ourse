
const Companys = require('../models/company')



exports.index = async (req, res, next) => {
   
    const companys = await Companys.findOne();
    console.log(companys)
    res.status(200).json({
        data : companys
    });
  };

