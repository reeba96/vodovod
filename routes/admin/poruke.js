var express = require('express');
var router = express.Router();
var rightPad = require('right-pad');

let Help = require('../../models/hlp');

// Poruka page
router.get('/', function(req, res, next) {
    if(req.session.komitent){
        if(req.session.komitent.sifra == 999100001) {
            Help.findAll({ order: [ [ '__record', 'DESC' ]], limit: 30 })
                .then(function (help) {
                    if (!help) {
                        req.flash('danger', 'Greska!');
                        res.redirect('admin/index');
                    } else {
                        res.render('admin/poruke', { 
                            title: 'Poruke', 
                            naziv: req.session.komitent.naziv,
                            sifra: req.session.komitent.sifra,
                            "helps": help
                        });
                    }      
                })
                .catch(function(err) { 
                    console.log(err); 
                    req.flash('danger', 'Greška!');
                    res.redirect('admin/index');
                });
        } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
    } else { res.redirect('/login'); }
});

// Add message
router.post('/addPoruka', function(req, res) {
    var lang_id = req.body.lang_id;
    var help_id = req.body.help_id;
    var hint = req.body.hint;
    var description = req.body.description;

    let newHelp = new Help;
        
    newHelp.lang_id = lang_id;
    newHelp.help_id = help_id;
    newHelp.hint = hint;
    newHelp.descript = description;

    newHelp.save().then(function(newHelp) { res.send("100"); }).catch(function(err) { res.send(err); });
});

// Delete message
router.get('/delete/:hint', function(req, res) {
  var hint = req.params.hint;
  
  if(req.session.komitent){
    if(req.session.komitent.sifra == 999100001){
      Help.findOne({ where: { hint: rightPad(hint, 200) } }).then(function (help) {
        help.destroy();
        req.flash('success', 'Poruka je izbrisan!');
        res.redirect('/admin/poruke');
      }); 
    } else { res.redirect('/login'); }
  }
});

module.exports = router;