var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer"); 
var smtpTransport = require("nodemailer-smtp-transport");

// O nama page
router.get('/', function(req, res, next) { res.render('oNama', { title: 'Kontakt' }); });

// Email sending
router.post('/', function(req, res, next) {

  const ime = req.body.ime;
  const email = req.body.email;
  const poruka = req.body.poruka;
        
  var transporter = nodemailer.createTransport({  
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {  
      user: process.env.MAIL_USER,  
      pass: process.env.MAIL_PASS 
    }  
  });

  var mailOptions = {  
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,  
    subject: 'From: ' + email,  
    text: poruka
  } 

  transporter.sendMail(mailOptions, function(error, info) {  
    if(error) { console.log(error); res.send(error); } 
    else {  res.send('600'); }  
  });
        
});  

module.exports = router;