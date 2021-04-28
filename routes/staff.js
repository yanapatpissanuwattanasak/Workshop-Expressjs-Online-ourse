var express = require('express');
var router = express.Router();
const passportJWT = require('../middleware/passportJWT')

const staffController = require("../controllers/staffController");

/* GET users listing. */
// http://localhost:3000/staff
router.get('/', staffController.index);

// http://localhost:3000/staff/awdawdasdasdasdasdasd
router.get('/:id', staffController.show);
//deletebyId
// http://localhost:3000/staff/awdawdasdasdasdasdasd
router.delete('/:id', staffController.destroy);

// http://localhost:3000/staff/awdawdasdasdasdasdasd
router.put('/:id', staffController.update);

// http://localhost:3000/staff
router.post('/', staffController.insert);

module.exports = router;
