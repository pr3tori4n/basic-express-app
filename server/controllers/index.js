const homeModel = require('../models/index');

const homeController =  function(req, res, next) {
    res.render('index', homeModel);
};

module.exports = homeController;