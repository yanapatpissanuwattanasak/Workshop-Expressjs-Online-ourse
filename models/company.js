const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name:  String, // String is shorthand for {type: String}
  address: {
    province : String
  },
    },{
      collection : 'companys'
  
});

const Companys = mongoose.model('eiei',schema)
module.exports = Companys
