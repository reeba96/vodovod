var express = require('express');
var router = express.Router();
var flash = require('req-flash');
var fs = require('fs');
var dateFormat = require('dateformat');
var multer = require('multer');

let Help = require('../../models/hlp');

// Storage javna nabavka
var storageSlika = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, './public/images/vesti/') },
  filename: function (req, file, cb) { cb(null, req.body.naslov + '.jpg') }
});

var uploadSlika = multer({ storage: storageSlika });

// GET REQUESTS

// Vesti upload page
router.get('/', function(req, res, next) {
    if(req.session.komitent){
      if(999200000 < req.session.komitent.sifra && req.session.komitent.sifra < 999300000){
        var now = new Date();
        var datum = dateFormat(now, "yyyy-mm-dd");

        res.render('knjigovodja/vesti', { 
            title: 'Vesti', 
            naziv: req.session.komitent.naziv,
            sifra: req.session.komitent.sifra,
            datum: datum
        });
      } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
    } else { res.redirect('/login'); }
});

// POST REQUESTS
// Save javne nabavke
router.post('/saveVesti', uploadSlika.single('vestiSlika'), function(req,res){
  var datum = req.body.datum;
  var naslov = req.body.naslov;
  var file = req.file;
  var sadrzaj = req.body.sadrzaj;

  if (!file) { req.flash('danger', 'Izaberite fajl (jpg)!'); res.redirect('/knjigovodja/vesti'); }
  else if (!naslov) { req.flash('danger', 'Popunite naslov polje!'); res.redirect('/knjigovodja/vesti'); }
  else if (!sadrzaj) { req.flash('danger', 'Popunite sadržaj polje!'); res.redirect('/knjigovodja/vesti'); }
  else if (!datum) { req.flash('danger', 'Popunite datum polje!'); res.redirect('/knjigovodja/vesti'); }
  else { 

    let newVest = new Help;
        
    newVest.lang_id = "SRB";
    newVest.help_id = "Vest";
    newVest.hint = naslov;
    newVest.descript = sadrzaj;
    newVest.datum = datum;
    newVest.arhiv = 0;

    newVest.save()
      .then(function(newVest) { req.flash('success', 'Uspešno postavljanje!'); res.redirect('/knjigovodja/vesti'); })
      .catch(function(err) { req.flash('danger', 'Greška! Pozovite administratora!'); res.redirect('/knjigovodja/vesti'); });
    }  
});

module.exports = router;