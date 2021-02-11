var express = require('express');
var flash = require('req-flash');
var router = express.Router();
var bodyParser = require('body-parser');
var pg = require('pg');
var bcrypt = require('bcryptjs');
var rightPad = require('right-pad');
var nodemailer = require("nodemailer");
var fs = require('fs');

let Help = require('../models/hlp');

// Index page
router.get('/', function(req, res, next) { 

  var directoryJavneNabavke     = './public/files/javneNabavke/';
  var fileTypeJavneNabavke = [];

  Help.findAll({ where: { help_id: 'Vest                     ', arhiv: 0 }, order: [ [ 'datum', 'DESC' ]], limit: 2 }).then(function (help) {
    if (!help) { req.flash('danger', 'Greska!'); res.redirect('index'); }
    else {
      // Javne nabavke kiolvasasa
      fs.readdir(directoryJavneNabavke, (err, filesJavneNabavke) => {
        filesJavneNabavke.forEach(file => {  
            // console.log(file); 
            ext = file.split(".");
            // console.log(ext[1]);
            fileTypeJavneNabavke.push(ext[1]);
        });
    
        if (filesJavneNabavke.length == 0) { filesJavneNabavke[0] = "Nema podataka"; }

        res.render('index', {
          title: 'Home',
          'filesJavneNabavke': filesJavneNabavke.reverse(),
          'fileTypeJavneNabavke' : fileTypeJavneNabavke.reverse(),
          'helps': help
        });

      });
    }      
  }).catch(function(err) { 
    console.log(err); 
    req.flash('danger', 'Greška!');
    res.redirect('admin/index');
  });

});

// POST REQUESTS

// Registration
router.post('/', function(req, res, next) {
  let Komitent = require('../models/komitent');
    
  var naziv = rightPad(req.body.ime, 60);
  var lozinka1 = req.body.lozinka1;
  var email = req.body.email;
  var lozinka2 = req.body.lozinka2;
  var sifra = rightPad(req.body.sifra, 10);
  var tel = req.body.telefon;
console.log("naziv:" + naziv + "!");
console.log("sifra:" + sifra + "!");
  Komitent.findOne({ where: { sifra: sifra, naziv: naziv } }).then(function (komitent) {
    if (!komitent) { res.send('400'); }
    else {
      bcrypt.hash(lozinka1, 10, function(err, hash){
        if(err){ console.log(err); }
        komitent.lozinka = hash + '§';
        komitent.tel = tel;
        komitent.email = email;
        komitent.save()
        .then(function(komitent) {

            var transporter = nodemailer.createTransport({  
              host: process.env.MAIL_HOST,
              port: process.env.MAIL_PORT,
              secure: true,
              auth: {  
                user: process.env.MAIL_USER,  
                pass: process.env.MAIL_PASS 
              }  
            });
                
            var ime = naziv;
            var poruka = "Kliknite na link i potvrdite email adresu: http://vodovodbezdan.rs/emailActivation/" + komitent.id;

            var mailOptions = {  
              from: process.env.MAIL_FROM,
              to: 'reeba96@gmail.com',
              // to: email  
              subject: 'Registracija',  
              text: poruka
            } 

            transporter.sendMail(mailOptions, function(error, info) {  
              if(error) { console.log(error); res.send(error); } 
              else {  res.send('600'); }  
            });
        })
        .catch(function(err) { console.log(err); res.send('700'); });
      });
    };
  });
});

module.exports = router;