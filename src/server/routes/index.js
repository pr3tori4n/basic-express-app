const express = require('express');
const router = express.Router();

const homeController = require('../controllers/index');

/* GET home page. */
router.get('/', homeController);

module.exports = router;
