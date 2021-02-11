var express = require('express');
var router = express.Router();
var flash = require('req-flash');

let Komitent = require('../../models/komitent');

// Get main page
router.get('/', function(req, res, next) {
  if(req.session.komitent){
    if(999300000 < req.session.komitent.sifra && req.session.komitent.sifra < 999400000){
      res.render('citac/index', { 
        title: 'JKP Vodovod Bezdan', 
        naziv: req.session.komitent.naziv,
        sifra: req.session.komitent.sifra
      });
    } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
  } else { res.redirect('/login'); }
});

module.exports = router;