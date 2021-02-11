var express = require('express');
var router = express.Router();
var flash = require('req-flash');
var pg = require('pg');
var { Client } = require('pg');
var { Parser } = require('json2csv');
var fs = require("fs");
var fastcsv = require("fast-csv");

require('dotenv').config();

// Backup page
router.get('/', function(req, res, next) {
  if(req.session.komitent){
      if(999100000 < req.session.komitent.sifra && req.session.komitent.sifra < 999200000){
          res.render('admin/backup', { 
              title: 'Backup',
              naziv: req.session.komitent.naziv,
              sifra: req.session.komitent.sifra,
          });
      } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
  } else { res.redirect('/login'); }
});

// EXPORTS

// Nalsta export
router.post('/exportNalsta', function(req, res, next) {
  const client = new Client();

  client.connect().then(() => { return client.query("SELECT * FROM nalsta"); }) .then((results) => {
      
    var data=[];
    for( var i = 0; i < results.rowCount; i++){ data.push(results.rows[i]); }

    const fields = [
      'vrsta', 'nalog', 'konto', 'mtnt', 'racun', 'datum', 'valuta', 'opis', 'duguje', 'potrazuje', 'saldo', 'oznaka', 'knjizen', 'sada',
      'prethodno', 'subvencija', 'cena', 'trobracuna', 'pdvopsta', 'pdvposebna', 'sadsamocit', 'datsamocit', 'sadcitac', 'datcitac', 'sifcitac', 'prosek', 
      'id'
    ];
      
    const json2csvParser = new Parser({ fields, delimiter: ";", quote: "", encoding: "utf8" });
    const csv = json2csvParser.parse(data);
      
    res.setHeader('Content-disposition', 'attachment; filename=nalsta.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);

  });
});

// NsNalsta export
router.post('/exportNsNalsta', function(req, res, next) {
  const client = new Client();

  client.connect().then(() => { return client.query("SELECT * FROM nsnalsta"); }) .then((results) => {
      
    var data=[];
    for( var i = 0; i < results.rowCount; i++){ data.push(results.rows[i]); }

    const fields = [
      'vrsta', 'nalog', 'konto', 'mtnt', 'racun', 'datum', 'valuta', 'opis', 'protukonto', 'duguje', 'potrazuje', 'saldo', 'oznaka', 'knjizen', 'sada',
      'prethodno', 'cena', 'trobracuna', 'pdvopsta', 'pdvposebna', 'sadsamocit', 'datsamocit', 'sadcitac', 'datcitac', 'sifcitac', 'prosek', 
      'id'
    ];
      
    const json2csvParser = new Parser({ fields, delimiter: ";", quote: "", encoding: "utf8" });
    const csv = json2csvParser.parse(data);
      
    res.setHeader('Content-disposition', 'attachment; filename=nsnalsta.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);

  });
});

// Komitent export
router.route('/exportKomitent').post((req, res) => {
  const client = new Client();

  client.connect().then(() => { return client.query("SELECT * FROM komitent"); }) .then((results) => {
      
      var data=[];
      for( var i = 0; i < results.rowCount; i++){ data.push(results.rows[i]); }

      const fields = [
        'sifra', 'naziv', 'adresa', 'mesto', 'adresarac', 'mestorac', 'tel', 'tel2', 'fax', 'email', 'osoba', 'ziro', 'ziro2', 'ziro3', 'ziro4', 
        'ziro5', 'ziro6', 'ziro7', 'ziro8', 'matbr', 'regbr', 'delatnost', 'konto', 'pib', 'odobrenje', 'napomena', 'otpremio', 'rabatmarza', 'updvsis',
        'valuta', 'mes01', 'mes02', 'mes03', 'mes04', 'mes05', 'mes06', 'mes07', 'mes08', 'mes09', 'mes10', 'mes11', 'mes12', 'lozinka', 'id'
      ];
        
      const json2csvParser = new Parser({ fields, delimiter: ";", quote: "", encoding: "utf8" });
      const csv = json2csvParser.parse(data);
        
      res.setHeader('Content-disposition', 'attachment; filename=komitent.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);

      });
});

// Konto export
router.route('/exportKonto').post((req, res) => {
  const client = new Client();

  client.connect()
    .then(() => { return client.query("SELECT * FROM konto"); }) 
    .then((results) => {
      
      var data=[];
      for( var i = 0; i < results.rowCount; i++){ data.push(results.rows[i]); }

      const fields = ['konto', 'tip', 'opis', 'aktivapocs', 'pasivapocs', 'aktiva', 'pasiva', 'napomena'];
        
      const json2csvParser = new Parser({ fields, delimiter: ";", quote: "", encoding: "utf8" });
      const csv = json2csvParser.parse(data);
        
      res.setHeader('Content-disposition', 'attachment; filename=konto.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);

      });
});

// IMPORTS

// Nalsta import
router.route('/importNalsta').post((req, res, next) => {

  let Nalsta = require('../../models/nalsta');

  var filePath = './public/tables/nalsta.csv';

  if (fs.existsSync(filePath)) {
    
    // Delete all records in table
    Nalsta.destroy({ truncate: true }).then(function() { 
      console.log("All rows deleted in nalsta table!");  

      let stream = fs.createReadStream(filePath);
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

            if (row[5] == "0000-00-00")  { row[5] = null; } 
            if (row[6] == "0000-00-00")  { row[6] = null; } 
            if (row[12] == "0000-00-00") { row[12] = null; } 
            if (row[21] == "0000-00-00") { row[21] = null; } 
            if (row[23] == "0000-00-00") { row[23] = null; } 
            
            client.query(query, row, (err) => { if(err) { res.end(err.stack); }  else { res.end("100"); } });  
          });      
        });
      });

      stream.pipe(csvStream);
      fs.unlink(filePath, (error) => { if (error) throw error; });
    })
  } else { res.end("Ne postoji nalsta.csv"); } 

});

// nsNalsta import
router.route('/importNsNalsta').post((req, res, next) => {

  let nsNalsta = require('../../models/nsnalsta');

  var filePath = './public/tables/nsnalsta.csv';

  if (fs.existsSync(filePath)) {
    
    // Delete all records in table
    nsNalsta.destroy({ truncate: true }).then(function() { 
      console.log("All rows deleted in nsnalsta table!");  

      let stream = fs.createReadStream(filePath);
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

            if (row[5] == "0000-00-00")  { row[5] = null; } 
            if (row[6] == "0000-00-00")  { row[6] = null; } 
            if (row[13] == "0000-00-00") { row[13] = null; } 
            if (row[22] == "0000-00-00") { row[22] = null; } 
            if (row[24] == "0000-00-00") { row[24] = null; } 
            
            client.query(query, row, (err) => { if(err) { res.end(err.stack); }  else { res.end("100"); } });  
          });      
        });
      });

      stream.pipe(csvStream);
      fs.unlink(filePath, (error) => { if (error) throw error; });
    })
  } else { res.end("Ne postoji nsnalsta.csv"); } 

});

// Komitent import
router.route('/importKomitent').post((req, res) => {
  let Komitent = require('../../models/komitent');

  var filePath = './public/tables/komitent.csv';

  if (fs.existsSync(filePath)) {
    
    // Delete all records in table
    Komitent.destroy({ truncate: true }).then(function() { 
      console.log("All rows deleted in komitent table! ");  

      let stream = fs.createReadStream(filePath);
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
          csvData.forEach(row => {  client.query(query, row, (err) => { if(err) { res.end(err.stack); } else { res.end("100"); }  }); });      
        });
      });

      stream.pipe(csvStream);
      fs.unlink(filePath, (error) => { if (error) throw error; });
    })
  } else { res.end("Ne postoji komitent.csv"); } 

});

// Konto import
router.route('/importKonto').post((req, res) => {
  let Konto = require('../../models/konto');

  var filePath = './public/tables/konto.csv';

  if (fs.existsSync(filePath)) {
    
    // Delete all records in table
    Konto.destroy({ truncate: true }).then(function() { 
      console.log("All rows deleted in konto table! ");  

      let stream = fs.createReadStream(filePath);
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
          csvData.forEach(row => { client.query(query, row, (err) => { if(err) { res.end(err.stack); } else { res.end("100"); } });});      
        });
      });

      stream.pipe(csvStream);
      fs.unlink(filePath, (error) => { if (error) throw error; });
    })
  } else { res.end("Ne postoji konto.csv"); } 

});

module.exports = router;