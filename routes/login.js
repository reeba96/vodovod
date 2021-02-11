var express = require('express');
var router = express.Router();
var session = require('express-session');
var pg = require('pg');
var { Client } = require('pg');
var { Parser } = require('json2csv');
var fs = require("fs");
var fastcsv = require("fast-csv");
var dateFormat = require('dateformat');

require('dotenv').config();

let Nalsta = require('../models/nalsta');
let nsNalsta = require('../models/nsnalsta');
let Komitent = require('../models/komitent');
let Konto = require('../models/konto');

// Login page
router.get('/', function(req, res, next) { res.render('login', { title: 'Prijava' }); });

// Login 
router.post('/', function(req, res, next) {
  var email = req.body.email;
  var lozinka = req.body.lozinka;

  Komitent.findOne({ where: { email: email } }).then(function (komitent) {
    if (!komitent) { 
      req.flash('danger', 'Nepostojeća email adresa!');
      res.redirect('/login');
    } else if (!komitent.validPassword(lozinka, komitent.lozinka.trim())) {
      req.flash('danger', 'Pogrešna lozinka!');
      res.redirect('/login');
    } else if(10000000 < Number(komitent.sifra.trim()) && Number(komitent.sifra.trim()) < 700000000){ 
      // Samocitac
      
      req.session.komitent = komitent.dataValues;
      res.redirect('/samocitac/index');
    } else if(999100000 < Number(komitent.sifra.trim()) && Number(komitent.sifra.trim()) < 999200000){
      // Administrator

      req.session.komitent = komitent.dataValues;
      res.redirect('/admin/index');
    } else if(999200000 < Number(komitent.sifra.trim()) && Number(komitent.sifra.trim()) < 999300000){
      // Knjigovodja

      let g = 0; let h = 0; let k = 0; let u = 0;

      // Log files
      var now = new Date();
      var datum = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
      var loggedInUser = komitent.dataValues.naziv;

      var nalstaLogFilePath = './public/tables/nalstaLog.txt';
      var kontoLogFilePath = './public/tables/kontoLog.txt';
      var komitentLogFilePath = './public/tables/komitentLog.txt';
      var nsNalstaLogFilePath = './public/tables/nsNalstaLog.txt';

      // Konto import
      var filePathKonto = './public/tables/konto.csv';

      if (fs.existsSync(filePathKonto)) {

        // Log file rows first data
        fs.appendFile(kontoLogFilePath, '{ "date": "'+ datum +'", "user": "' + loggedInUser.trim() + '"', function(err) { if(err) { return console.log(err); } }); 
        
        // Delete all records in table
        Konto.destroy({ truncate: true }).then(function() { 
          console.log("All rows deleted in konto table! ");  

          let stream = fs.createReadStream(filePathKonto);
          let csvData = [];
          let csvStream = fastcsv.parse({ delimiter: ';', encoding: 'utf8' }).on("data", function(data) { csvData.push(data); }).on("end", function() {
      
            // Connect to the PostgreSQL database and save data
            const Pool = require("pg").Pool;

            // Remove the first line: header
            csvData.shift();

            // Create a new connection pool to the database
            const pool = new Pool({
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              database: process.env.DB_NAME,
              password: process.env.DB_PASS,
              port: process.env.DB_PORT
            });

            const query = "INSERT INTO konto (konto, tip, opis, aktivapocs, pasivapocs, aktiva, pasiva, napomena) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";

            pool.connect((err, client, done) => {
              if (err) throw err;
              csvData.forEach(row => { h = h + 1; client.query(query, row, (err) => { if(err) { res.end(err.stack); } }); }); 

              // Log file content
              fs.appendFile(kontoLogFilePath, ', "imported CSV rows": "' + h + '" } \n', function(err) { if(err) { return console.log(err); } });   
            });

          });

          stream.pipe(csvStream);
          fs.unlink(filePathKonto, (error) => { if (error) throw error; });
        })
      } else { console.log("Ne postoji konto.csv"); } 

      // Komitent import
      var filePathKomitent = './public/tables/komitent.csv';

      if (fs.existsSync(filePathKomitent)) {

        // Log file rows first data
        fs.appendFile(komitentLogFilePath, '{ "date": "'+ datum +'", "user": "' + loggedInUser.trim() + '"', function(err) { if(err) { return console.log(err); } }); 
        
        // Delete all records in table
        Komitent.destroy({ truncate: true }).then(function() { 
          console.log("All rows deleted in komitent table! ");  

          let stream = fs.createReadStream(filePathKomitent);
          let csvData = [];
          let csvStream = fastcsv.parse({ delimiter: ';', encoding: 'utf8' }).on("data", function(data) { csvData.push(data); }).on("end", function() {
      
            // Connect to the PostgreSQL database and save data
            const Pool = require("pg").Pool;

            // Remove the first line: header
            csvData.shift();

            // Create a new connection pool to the database
            const pool = new Pool({
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              database: process.env.DB_NAME,
              password: process.env.DB_PASS,
              port: process.env.DB_PORT
            });

            const query = "INSERT INTO komitent (sifra, naziv, adresa, mesto, adresarac, mestorac, tel, tel2, fax, email," +
              "osoba, ziro, ziro2, ziro3, ziro4, ziro5, ziro6, ziro7, ziro8, matbr, regbr, delatnost, konto, pib, odobrenje, napomena, otpremio, " + 
              "rabatmarza, updvsis, valuta, mes01, mes02, mes03, mes04, mes05, mes06, mes07, mes08, mes09, mes10, mes11, mes12, lozinka, id) " +
              "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29," +
              "$30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44)";

            pool.connect((err, client, done) => {
              if (err) throw err;
              csvData.forEach(row => {  k = k + 1; client.query(query, row, (err) => { if(err) { res.end(err.stack); } }); });   

              // Log file content
              fs.appendFile(komitentLogFilePath, ', "imported CSV rows": "' + k + '" } \n', function(err) { if(err) { return console.log(err); } });
            });
          });

          stream.pipe(csvStream);
          fs.unlink(filePathKomitent, (error) => { if (error) throw error; });
        })
      } else { console.log("Ne postoji komitent.csv"); } 

      // nsNalsta import
      var filePathnsNalsta = './public/tables/nsnalsta.csv';

      if (fs.existsSync(filePathnsNalsta)) {

        // Log file rows first data
        fs.appendFile(nsNalstaLogFilePath, '{ "date": "'+ datum +'", "user": "' + loggedInUser.trim() + '"', function(err) { if(err) { return console.log(err); } }); 
        
        // Delete all records in table
        nsNalsta.destroy({ truncate: true }).then(function() { 
          console.log("All rows deleted in nsnalsta table!");  

          let stream = fs.createReadStream(filePathnsNalsta);
          let csvData = [];
          let csvStream = fastcsv.parse({ delimiter: ';', encoding: 'utf8'}).on("data", function(data) { csvData.push(data); }).on("end", function() {
      
            // Connect to the PostgreSQL database and save data
            const Pool = require("pg").Pool;

            // Remove the first line: header
            csvData.shift();

            // Create a new connection pool to the database
            const pool = new Pool({
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              database: process.env.DB_NAME,
              password: process.env.DB_PASS,
              port: process.env.DB_PORT
            });

            const query = "INSERT INTO nsnalsta (vrsta, nalog, konto, mtnt, racun, datum, valuta, opis, protukonto, duguje, potrazuje," +
              "saldo, oznaka, knjizen, sada, prethodno, subvencija, cena, trobracuna, pdvopsta, pdvposebna, sadsamocit, datsamocit, sadcitac, datcitac, sifcitac, prosek, id) " + 
              "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)";

            pool.connect((err, client, done) => {
              if (err) throw err;
              csvData.forEach(row => {

                // Row counter
                u = u + 1;

                if (row[5] == "0000-00-00")  { row[5] = null; } 
                if (row[6] == "0000-00-00")  { row[6] = null; } 
                if (row[13] == "0000-00-00") { row[13] = null; } 
                if (row[22] == "0000-00-00") { row[22] = null; } 
                if (row[24] == "0000-00-00") { row[24] = null; } 
                
                client.query(query, row, (err) => { if(err) { res.end(err.stack); } });  
              });  
                 
              // Log file content
              fs.appendFile(nsNalstaLogFilePath, ', "imported CSV rows": "' + u + '" } \n', function(err) { if(err) { return console.log(err); } }); 
            });
          });

          stream.pipe(csvStream);
          fs.unlink(filePathnsNalsta, (error) => { if (error) throw error; });
        })
      } else { console.log("Ne postoji nsnalsta.csv"); } 

      // Nalsta import
      var filePathNalsta = './public/tables/nalsta.csv';

      if (fs.existsSync(filePathNalsta)) {

        // Log file rows first data
        fs.appendFile(nalstaLogFilePath, '{ "date": "' + datum +'", "user": "' + loggedInUser.trim() + '"', function(err) { if(err) { return console.log(err); } }); 
        
        // Delete all records in table
        Nalsta.destroy({ truncate: true }).then(function() { 
          console.log("All rows deleted in nalsta table!");  
    
          let stream = fs.createReadStream(filePathNalsta);
          let csvData = [];
          let csvStream = fastcsv.parse({ delimiter: ';', encoding: 'utf8'}).on("data", function(data) { csvData.push(data); }).on("end", function() {
      
            // Connect to the PostgreSQL database and save data
            const Pool = require("pg").Pool;
    
            // Remove the first line: header
            csvData.shift();
    
            // Create a new connection pool to the database
            const pool = new Pool({
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              database: process.env.DB_NAME,
              password: process.env.DB_PASS,
              port: process.env.DB_PORT
            });
            
            const query = "INSERT INTO nalsta (vrsta, nalog, konto, mtnt, racun, datum, valuta, opis, duguje, potrazuje," +
              "saldo, oznaka, knjizen, sada, prethodno, subvencija, cena, trobracuna, pdvopsta, pdvposebna, sadsamocit, datsamocit, sadcitac, datcitac, sifcitac, prosek, id) " + 
              "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)";
            
            pool.connect((err, client, done) => {
              if (err) throw err;
              csvData.forEach(row => {

                // Row counter
                g = g + 1;

                if (row[5] == "0000-00-00")  { row[5] = null; } 
                if (row[6] == "0000-00-00")  { row[6] = null; } 
                if (row[12] == "0000-00-00") { row[12] = null; } 
                if (row[21] == "0000-00-00") { row[21] = null; } 
                if (row[23] == "0000-00-00") { row[23] = null; } 
                
                client.query(query, row, (err) => { if(err) { res.end(err.stack); } });  
              });   

              // Log file content
              fs.appendFile(nalstaLogFilePath, ', "imported CSV rows": "' + g + '" } \n', function(err) { if(err) { return console.log(err); } });   
            });
          });
    
          stream.pipe(csvStream);
          fs.unlink(filePathNalsta, (error) => { if (error) throw error; });
        })
      } else { console.log("Ne postoji nalsta.csv"); } 

      req.session.komitent = komitent.dataValues;
      res.redirect('/knjigovodja/index');

    } else if(999300000 < Number(komitent.sifra.trim()) && Number(komitent.sifra.trim()) < 999400000){
      // Citac

      req.session.komitent = komitent.dataValues;
      res.redirect('/citac/index');
    } else {
      req.flash('danger', 'Nemate pravo pristupa!');
      res.redirect('/login');
    }       
  })
  .catch(function(err) { 
    console.log(err); 
    req.flash('danger', 'Greška u prijavi! Pozovite administratora!');
    res.redirect('/login');
  });
});
    
module.exports = router;