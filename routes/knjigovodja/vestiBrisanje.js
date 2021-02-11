var express = require('express');
var router = express.Router();
var flash = require('req-flash');
var fs = require('fs');
var multer = require('multer');

let Help = require('../../models/hlp');

// Vesti delete page
router.get('/', function(req, res, next) {
  if(req.session.komitent){
    if(999200000 < req.session.komitent.sifra && req.session.komitent.sifra < 999300000){
      Help.findAll({ where: { lang_id: 'SRB', help_id: 'Vest                     ' }, order: [ [ '__record', 'DESC' ]] }).then(function (help) {
        if (!help) { req.flash('danger', 'Greska!'); res.redirect('knjigovodja/vestiBrisanje'); }
        else {
          res.render('knjigovodja/vestiBrisanje', { 
              title: 'Vesti', 
              naziv: req.session.komitent.naziv,
              sifra: req.session.komitent.sifra,
              "helps": help
          });
        }      
      })
      .catch(function(err) { 
        console.log(err); 
        req.flash('danger', 'Greška!');
        res.redirect('knjigovodja/vestiBrisanje');
      });

    } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
  } else { res.redirect('/login'); }
});

// POST REQUESTS

// Archive vesti
router.route('/arhiv').post((req, res) => {
  var hint = req.body.hint;
  console.log(hint);
  Help.findOne({ where: { hint: hint } }).then(function (help) {
    if (help) { 
      if(help.arhiv == 1){ 
        Help.update({ arhiv: 0 }, { where: { hint: hint } }).catch(function(err) { res.send("100"); console.log(err); }); 
        res.send("500");
      } else if(help.arhiv == 0) { 
        Help.update({ arhiv: 1 }, { where: { hint: hint } }).catch(function(err) { res.send("100"); console.log(err); }); 
        res.send("500");
      }
    } else { res.send("100"); }
  });
});

// Delete vesti
router.route('/delete').post((req, res) => {
  fs.unlink('./public/images/vesti/' + req.body.hint.trim() + '.jpg', (err) => {
    if (err) { console.error(err); res.send("100"); }
    else {
      Help.destroy({ where: { hint: req.body.hint } }).catch(function(err) { res.send("100"); console.log(err); });
      res.send("500");
    }
  });
});

 module.exports = router;