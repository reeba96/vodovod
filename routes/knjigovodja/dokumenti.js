var express = require('express');
var router = express.Router();
var flash = require('req-flash');
var fs = require('fs');
var multer = require('multer');

// Storage javna nabavka
var storageJavnaNabavka = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, './public/files/javneNabavke/') },
  filename: function (req, file, cb) { cb(null, file.originalname) }
});
var uploadJavnaNabavka = multer({ storage: storageJavnaNabavka });

// Storage izvestaji
var storageIzvestaj = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, './public/files/izvestaji/') },
  filename: function (req, file, cb) { cb(null, file.originalname) }
});
var uploadIzvestaj = multer({ storage: storageIzvestaj });

// Storage osnovni dokumenti
var storageOsnovniDokument = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, './public/files/osnovniDokumenti/') },
  filename: function (req, file, cb) { cb(null, file.originalname) }
});
var uploadOsnovniDokument = multer({ storage: storageOsnovniDokument });

// Storage radne biografije
var storageRadnaBiografija = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, './public/files/radneBiografije/') },
  filename: function (req, file, cb) { cb(null, file.originalname) }
});
var uploadRadnaBiografija = multer({ storage: storageRadnaBiografija });

// GET REQUESTS

// Javne nabavke strana
router.get('/', function(req, res, next) {
  if(req.session.komitent){
    if(999200000 < req.session.komitent.sifra && req.session.komitent.sifra < 999300000){
      var directoryJavneNabavke = './public/files/javneNabavke/';
      var fileType = [];

      fs.readdir(directoryJavneNabavke, (err, files) => {
        files.forEach(file => {  
            // console.log(file); 
            ext = file.split(".");
            // console.log(ext[1]);
            fileType.push(ext[1]);
        });

        if (files.length == 0) { files[0] = "Nema podataka"; }

        res.render('knjigovodja/dokumenti', {
          title: 'Dokumenti',
          naziv: req.session.komitent.naziv,
          sifra: req.session.komitent.sifra,
          'files': files,
          'fileTypes' : fileType,
          arrayLength: files.length
        });

      });    

    } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
  } else { res.redirect('/login'); }
});

// POST REQUESTS

// Save javne nabavke
router.post('/saveJavnaNabavka', uploadJavnaNabavka.single('javnaNabavka'), function(req,res){
  var file = req.file;
  if (!file) { req.flash('danger', 'Izaberite fajl (doc, docx, pdf)!'); res.redirect('/knjigovodja/dokumenti'); }
  else { req.flash('success', 'Uspešno postavljanje!'); res.redirect('/knjigovodja/dokumenti'); }  
});

// Save izvestaji
router.post('/saveIzvestaj', uploadIzvestaj.single('izvestaj'), function(req,res){
  var file = req.file;
  if (!file) { req.flash('danger', 'Izaberite fajl (doc, docx, pdf)!'); res.redirect('/knjigovodja/dokumenti'); }
  else { req.flash('success', 'Uspešno postavljanje!'); res.redirect('/knjigovodja/dokumenti'); } 
});

// Save osnovni dokumenti
router.post('/saveOsnovniDokument', uploadOsnovniDokument.single('osnovniDokument'), function(req,res){
  var file = req.file;
  if (!file) { req.flash('danger', 'Izaberite fajl (doc, docx, pdf)!'); res.redirect('/knjigovodja/dokumenti'); }
  else { req.flash('success', 'Uspešno postavljanje!'); res.redirect('/knjigovodja/dokumenti'); } 
});

// Save radne biografije
router.post('/saveRadnaBiografija', uploadRadnaBiografija.single('radnaBiografija'), function(req, res, next) {
  var file = req.file;
  if (!file) { req.flash('danger', 'Izaberite fajl (doc, docx, pdf)!'); res.redirect('/knjigovodja/dokumenti'); }
  else { req.flash('success', 'Uspešno postavljanje!'); res.redirect('/knjigovodja/dokumenti'); } 
});

module.exports = router;