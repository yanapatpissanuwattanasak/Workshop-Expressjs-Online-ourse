var express = require('express');
var router = express.Router();


const shopController = require("../controllers/shopController");

/* GET users listing. */
// http://localhost:3000/users
router.get('/', shopController.index);

router.get('/menu', shopController.menu);

router.get('/:id', shopController.getShopWithMenu);

router.post('/', shopController.insert);
module.exports = router;
