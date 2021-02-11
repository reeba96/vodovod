var express = require('express');
var router = express.Router();

let nsNalsta = require('../../models/nsnalsta');

// GET REQUESTS

// Get page
router.get('/', function(req, res, next) {
  if(req.session.komitent){
    if(999100000 < req.session.komitent.sifra && req.session.komitent.sifra < 999200000){
      nsNalsta.findAll( { limit: 50, order: [["datum", "DESC"]]  })
        .then(function (nsnalsta) {
          if (!nsnalsta) {
            req.flash('danger', 'Nepostoji ni jedna stavka!');
            res.redirect('admin/nsnalsta');
          } else {
            res.render('admin/nsnalsta', { 
              title: 'Admin', 
              naziv: req.session.komitent.naziv,
              sifra: req.session.komitent.sifra,
              'nsnalstas': nsnalsta
            });
          }      
        })
        .catch(function(err) { 
            console.log(err); 
            req.flash('danger', 'Greška u prijavi!');
            res.redirect('/login');
        });
    } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
  } else { res.redirect('/login'); }
});

// POST REQUESTS

module.exports = router;