const express = require('express');
const router = express.Router();
const yarnController = require('../controllers/yarnController');

router.get('/getYarnInventory', yarnController.getYarnInventory);
router.get('/getYarnByType', yarnController.getYarnByType);
router.get('/filterYarnInventory', yarnController.filterYarnInventory);
router.get('/getTeams', yarnController.getTeams);
router.get('/getYarnByTeam', yarnController.getYarnByTeam);

module.exports = router;
