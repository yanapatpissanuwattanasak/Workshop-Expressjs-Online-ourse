const User = require("../models/user")
const {  validationResult } = require('express-validator');
jwt = require('jsonwebtoken');
const config = require('../config/index')


exports.index =  (req, res, next) => {
    res.status(200).json({
      message : "EiEi Login Success"
    })
  };

  exports.me =  (req, res, next) => {
      const {_id , name , email,role} = req.user
    res.status(200).json({
      user : {
          id : _id,
          name : name,
          email : email,
          role : role,
      }
    })
  };

exports.login = async (req, res, next) => {


    try {
        const {name , email , password} = req.body;

      

        const user =  await User.findOne({email : email});
        if(!user){
           const error = new Error("Not Found User")
           error.statusCode = 404 ;
           throw error ;
        }

        // ตรวจสอบรหัสผ่าน
        const isValid = await user.checkPassword(password)
        if(!isValid){
            const error = new Error("password not correct")
            error.statusCode = 400 ;
            throw error ;

        }
        //create token
        const token = await jwt.sign({
            id : user.id,
            role : user.role
        },config.JWT_SECRET,{expiresIn : '2h'})

        //decode exprie
        const expires_in = jwt.decode(token)

        res.status(200).json({
            access_token : token,
            expire_in : expires_in.exp,
            token_type : "Bearer"
          })
    
    
        
    } catch (error) {

        next(error);
    }

    

  
  }

  exports.register = async (req, res, next) => {
   
    try {
        const {name , email , password} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error = new Error("asdasd");
          error.statusCode = 422 ;
          error.validation = errors.array()
          throw error ;
        }

        const existEmail =  await User.findOne({email : email});
        if(existEmail){
           const error = new Error("Email has been use")
           error.statusCode = 400 ;
           throw error ;
        }
    
        let user = new User();
        user.name =  name ;
        user.email = email;
        user.password = await user.encryptPassword(password) ;
        await user.save();
        res.status(200).json({
            message : "EiEi Register Success"
          })
    
    
        
    } catch (error) {

        next(error);
    }

    
  }