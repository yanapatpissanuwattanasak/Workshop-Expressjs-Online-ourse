var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', (req, res, next) => {
  //res.render('index', { title: 'Expressasdasd' });
  res.status(200).json({
    message : "EiEi"
  })
});

module.exports = router;
