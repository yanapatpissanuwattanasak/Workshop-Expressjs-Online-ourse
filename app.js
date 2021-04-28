const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
//import middleware
const errorHandler = require("./middleware/errorHandler");

//require config
const config = require('./config/index')
const passportJWT = require('./middleware/passportJWT')


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const companyRouter = require('./routes/company');
const staffRouter = require('./routes/staff');
const shopRouter = require('./routes/shop');
const mongoose = require('mongoose');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
var cors = require('cors')


const app = express();
app.use(cors())
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 15 * 1000, // 15 minutes
    max: 5 // limit each IP to 100 requests per windowMs
  });
  
app.use(limiter);
app.use(helmet());

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify : false,
   
});


app.use(logger('dev'));
app.use(express.json({
    limit : '50mb'
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//init passport
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/company', companyRouter);
app.use('/staff',[passportJWT.isLogin] ,staffRouter);
app.use('/shop', shopRouter);

app.use(errorHandler)
module.exports = app;
