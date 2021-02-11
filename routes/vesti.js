var express = require('express');
var router = express.Router();

let Help = require('../models/hlp');

// Vesti page
router.get('/', function(req, res, next) {
  Help.findAll({ where: { lang_id: 'SRB', help_id: 'Vest                     ', arhiv: 0 }, order: [ [ 'datum', 'DESC' ]], limit: 15 }).then(function (help) {
    res.render('vesti', {
      lg: 'SRB',
      title: 'Vesti',
      'helps': help
    });
  });
});

module.exports = router;