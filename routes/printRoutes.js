const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const printController = require('../controllers/printController');

router.post('/printOrder', upload.single('file'), printController.printOrder);

module.exports = router;
