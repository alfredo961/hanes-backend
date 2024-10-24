const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/getOrderNumber', orderController.getOrderNumber);

module.exports = router;
