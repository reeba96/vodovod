var express = require('express');
var router = express.Router();

let Help = require('../models/hlp');

// Istorijat page
router.get('/', function(req, res, next) {
    Help.findAll({ where: { lang_id: 'SRB' } }).then(function (help) {
        res.render('istorijat', {
            lg: 'SRB',
            title: 'Istorijat',
            'helps': help
        });
    });
});

module.exports = router;