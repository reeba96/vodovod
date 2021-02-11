var express = require('express');
var router = express.Router();
var flash = require('req-flash');
var bodyParser = require('body-parser');
var leftPad = require('left-pad');
var rightPad = require('right-pad');
var bcrypt = require('bcryptjs');

let Komitent = require('../../models/komitent');

// Get main page
router.get('/', function(req, res, next) {
    if(req.session.komitent){
        if(999100000 < req.session.komitent.sifra && req.session.komitent.sifra < 999200000) {
            Komitent.findAll( { limit: 50 })
                .then(function (komitent) {
                    if (!komitent) {
                        req.flash('danger', 'Komitent ne postoji!');
                        res.redirect('admin/index');
                    } else {
                        res.render('admin/index', { 
                            title: 'Admin', 
                            naziv: req.session.komitent.naziv,
                            sifra: req.session.komitent.sifra,
                            'komitents': komitent
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

// List komitent
router.get('/list', function(req, res) {
    if(req.session.komitent){
      Komitent.findAll()
        .then(function (komitent) {
            if (!komitent) {
                req.flash('danger', 'Ne postoji ni jedan komitent!');
                res.redirect('admin/index');
            } else {
                res.render('admin/listKomitent', { 
                    title: 'Admin', 
                    naziv: req.session.komitent.naziv,
                    sifra: req.session.komitent.sifra,
                    'komitents': komitent
                });
            }      
        })
        .catch(function(err) { 
            console.log(err); 
            req.flash('danger', 'Greška u prijavi!');
            res.redirect('/login');
        });
    } else { res.redirect('/login'); }
});

// POST REQUESTS

router.route('/search').post((req, res) => {
    var sifra = req.body.sifra;
  
    Komitent.findOne({ where: { sifra: rightPad(sifra, 10) } }).then(function (komitent) {
      if (!komitent) {
          req.flash('danger', 'Tražena šifra ne postoji!');
          res.redirect('/admin/index');
      } else {
        res.render('admin/resultKomitent', { 
          title: 'Admin', 
          naziv: req.session.komitent.naziv,
          sifra: req.session.komitent.sifra,
          komitent: komitent
        });
      }
    });
});

module.exports = router;