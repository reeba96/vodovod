var express = require('express');
var router = express.Router();
var flash = require('req-flash');
var dateFormat = require('dateformat');
var random = require('random');
var rightPad = require('right-pad');
var fs = require('fs');

let nsNalsta = require('../../models/nsnalsta');

// GET REQUESTS

// Get main page
router.get('/', function(req, res, next) {
  if(req.session.komitent){
    if(999200000 < req.session.komitent.sifra && req.session.komitent.sifra < 999300000){
      var now = new Date();
      var datum = dateFormat(now, "yyyy-mm-dd");
      var filePathNsNalstaCSV = "./public/tables/nsnalsta.csv";

      if (fs.existsSync(filePathNsNalstaCSV)) {
        res.render('knjigovodja/index', { 
          title: 'Blagajna', 
          naziv: req.session.komitent.naziv,
          sifra: req.session.komitent.sifra,
          datum: datum
        }); 
      } else {
        // Read import dates from files
        fs.readFile('./public/tables/nsNalstaLog.txt', 'utf-8', function(err, data) {
          if (err) {
            res.render('knjigovodja/index', { 
              title: 'Blagajna', 
              naziv: req.session.komitent.naziv,
              sifra: req.session.komitent.sifra,
              datum: datum
            }); 
          } else {
            var lines = data.trim().split('\n');
            var nsNalstaLastLine = lines.slice(-1)[0];
            var nsNalstaLastLineJSON = JSON.parse(nsNalstaLastLine);

            console.log(nsNalstaLastLineJSON.date);
            res.render('knjigovodja/index', { 
              title: 'Blagajna', 
              naziv: req.session.komitent.naziv,
              sifra: req.session.komitent.sifra,
              datum: datum
            }); 
          }
      });
      }
    } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
  } else { res.redirect('/login'); }
});

// POST REQUESTS

// Dug knjizenje
router.route('/dug').post((req, res) => {

  let now = new Date();
  let newNsNalsta = new nsNalsta;
  var id = "WWWVODBZ";
  
  // If exits record in nsnalsta
  nsNalsta.findOne({ where: { konto: rightPad(req.body.konto, 13) } }).then(function (nsnalsta) {
    if (nsnalsta) { 
      id = id + dateFormat(now, "yyyymmddhhmmss") + random.int(min = 100, max = 999);
      nsNalsta.update({ 
        datum : req.body.datum,
        vrsta: "B",
        potrazuje : req.body.dug,
        sifcitac : req.session.komitent.sifra,
        datcitac : dateFormat(now, "yyyy-mm-dd"),
        id : id
      }, { where: { konto: rightPad(req.body.konto, 13) } }).catch(function(err) { res.send("100"); console.log(err); });
      res.send("500");
    } else {
      newNsNalsta.konto = req.body.konto;
      newNsNalsta.datum = req.body.datum;
      newNsNalsta.vrsta = "B";
      newNsNalsta.potrazuje = req.body.dug;
      newNsNalsta.sifcitac = req.session.komitent.sifra;
      newNsNalsta.datcitac = dateFormat(now, "yyyy-mm-dd");
      id = id + dateFormat(now, "yyyymmddhhmmss") + random.int(min = 100, max = 999);
      newNsNalsta.id = id;
      newNsNalsta.save().then(function(newNsNalsta) { res.send("500"); }).catch(function(err) { res.send("100"); console.log(err); }); 
    }
  });
  
});

module.exports = router;