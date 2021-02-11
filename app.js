var express = require('express');
var app = express();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var pg = require('pg');
var { Client } = require('pg');
var upperCase = require('upper-case');
require('dotenv').config();
var common = require('./common');
var leftPad = require('left-pad');
var rightPad = require('right-pad');
var Sequelize = require('sequelize');

var indexRouter = require('./routes/index');
var vestiRouter = require('./routes/vesti');
var dokumentiRouter = require('./routes/dokumenti');
var istorijatRouter = require('./routes/istorijat');
var oNamaRouter = require('./routes/oNama');
var loginRouter = require('./routes/login');

// Admin
var adminindexRouter = require('./routes/admin/index');
var nalstaRouter = require('./routes/admin/nalsta');
var nsnalstaRouter = require('./routes/admin/nsnalsta');
var porukeRouter = require('./routes/admin/poruke');
var backupRouter = require('./routes/admin/backup');

// Citac
var citacIndexRouter = require('./routes/citac/index');

// Knjigovodja
var knjigovodjaIndexRouter = require('./routes/knjigovodja/index');
var knjigovodjaDokumentiRouter = require('./routes/knjigovodja/dokumenti');
var knjigovodjaVestiRouter = require('./routes/knjigovodja/vesti');
var kg = require('./routes/knjigovodja/vestiBrisanje');

// Samocitac
var samocitacIndexRouter = require('./routes/samocitac/index');

// Models
let Nalsta = require('./models/nalsta');
let Komitent = require('./models/komitent');
let nsNalsta = require('./models/nsnalsta');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Express Session middleware
var hour = 3600000;
app.use(session({
  key: 'sifra',
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + hour),
    maxAge: hour
  }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/vesti', vestiRouter);
app.use('/istorijat', istorijatRouter);
app.use('/oNama', oNamaRouter);
app.use('/dokumenti', dokumentiRouter);
app.use('/login', loginRouter);

// Admin
app.use('/admin/index', adminindexRouter);
app.use('/admin/nalsta', nalstaRouter);
app.use('/admin/nsnalsta', nsnalstaRouter);
app.use('/admin/poruke', porukeRouter);
app.use('/admin/backup', backupRouter);

// Citac
app.use('/citac/index', citacIndexRouter);

// Knjigovodja
app.use('/knjigovodja/index', knjigovodjaIndexRouter);
app.use('/knjigovodja/dokumenti', knjigovodjaDokumentiRouter);
app.use('/knjigovodja/vesti', knjigovodjaVestiRouter);
app.use('/knjigovodja/vestiBrisanje', kg);

// Samocitac
app.use('/samocitac/index', samocitacIndexRouter);

// Odjava
app.get('/odjava', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

// Email activation
app.get('/emailActivation/:id', function(req, response) {
    Komitent.findOne({ where: { id: req.params.id } }).then(function (komitent) {
        var str = komitent.lozinka.replace(/\s/g, '');
        var res = str.slice(-1);

        if(res == "§"){
            str = str.slice(0, -1);
            komitent.lozinka = str;
            
            komitent.save()
            .then(function(komitent) {
                req.flash('success', 'Vaš nalog je aktivan!');
                response.redirect('/');
            })
            
        } else { 
            req.flash('warning', 'Nalog je već aktivan!');
            response.redirect('/');
        }
    }) 
});

// AJAX ulica search
app.get('/citac/index/Ulicasearch', function(req,res) {
    const client = new Client();
      client.connect()
        .then(() => {
            return client.query("SELECT * FROM komitent WHERE adresa LIKE '%" + upperCase(req.query.key) +"%' LIMIT 10");
        }) 
        .then((results) => {
          var data=[];
          for( var i = 0; i < results.rowCount; i++){
            data.push(results.rows[i].adresa.trim());
            // console.log(results.rows[i].adresa.trim());
          }
          res.end(JSON.stringify(data));
        })
        .catch((err) => {
            console.log('error', err);
            res.send('Something bad happened!');
        });
});

// AJAX naziv search
app.get('/citac/index/Nazivsearch', function(req,res) {
    const client = new Client();
      client.connect()
        .then(() => {
            return client.query("SELECT * FROM komitent WHERE naziv LIKE '%" + upperCase(req.query.key) +"%' LIMIT 10");
        }) 
        .then((results) => {
          var data=[];
          for( var i = 0; i < results.rowCount; i++){
            data.push(results.rows[i].naziv.trim());
            // console.log(results.rows[i].naziv.trim());
          }
          res.end(JSON.stringify(data));
        })
        .catch((err) => {
            console.log('error', err);
            res.send('Something bad happened!');
        });
});

// AJAX konto search
app.get('/knjigovodja/Kontosearch', function(req,res) {
  var input = req.query.key;

  // If input number
  if(/^\d+$/.test(input)) {
    const client = new Client();
    client.connect()
      .then(() => {
          return client.query("SELECT * FROM nalsta WHERE konto LIKE '%" + upperCase(input) +"%' LIMIT 10");
      }) 
      .then((results) => {
        var data = [];
        var userName = '';
        for(var i = 0; i < results.rowCount; i++) {
          data.push(results.rows[i].konto.trim());
          // console.log(results.rows[i].konto.trim());
        }
        res.end(JSON.stringify(data));
      })
      .catch((err) => {
          console.log('error', err);
          res.send('Something bad happened!');
      });
   } else {
    const client = new Client();
    client.connect()
      .then(() => {
          return client.query("SELECT * FROM komitent WHERE naziv LIKE '%" + upperCase(input) +"%' LIMIT 10");
      }) 
      .then((results) => {
        var data = [];
        var userName = '';
        for(var i = 0; i < results.rowCount; i++) {
          data.push(results.rows[i].naziv.trim());
          // console.log(results.rows[i].naziv.trim());
        }
        res.end(JSON.stringify(data));
      })
      .catch((err) => {
          console.log('error', err);
          res.send('Something bad happened!');
      });
   }
});

// AJAX fill user data
app.post('/knjigovodja/index', function(req, res) {
  var input = req.body.input;
  var type = req.body.type;

  var Op = Sequelize.Op;

  // Konto serach
  if(type == 1){
    var konto = input.toString().substring(3);
    var sifra = Number(konto).toString();
  
    Komitent.findOne({ where: { sifra: rightPad(sifra, 10) } }).then(function (komitent) {
      if (!komitent) { res.send({ ime: "Nepostoji" }) }
      else {
        Nalsta.findAll({ where: { konto: rightPad(req.body.input, 13) }, order: [["datum", "ASC"]]  }).then(function (nalsta) {
          if ( nalsta === undefined || nalsta.length == 0 ) { res.send("500"); } 
          else { 
            nsNalsta.findOne({ where: { konto: rightPad(input, 13) } }).then(function (nsnalsta) {
              if (nsnalsta) { 
                res.send({ 
                  ime: komitent.naziv.trim(), 
                  sifra: komitent.sifra.trim(),
                  mesto: komitent.mesto.trim(), 
                  adresa: komitent.adresa.trim(),
                  dug: nsnalsta.potrazuje.trim(),
                  nalsta: JSON.stringify(nalsta)
                }); 
              }
              else { 
                res.send({ 
                  ime: komitent.naziv.trim(), 
                  sifra: komitent.sifra.trim(),
                  mesto: komitent.mesto.trim(), 
                  adresa: komitent.adresa.trim(),
                  dug: "",
                  nalsta: JSON.stringify(nalsta)
                }); 
              }
            });
          };
        }); 
      };
    });
  } else if(type == 2){
    var naziv = input.toString();
    
    Komitent.findOne({ where: { naziv: { [Op.substring]: '%'+ upperCase(naziv) +'%' } } }).then(function (komitent) {
      if (!komitent) { res.send({ ime: "Nepostoji" }) }
      else {
        var komitentSifra = komitent.sifra.trim();
        var sifraLength = komitentSifra.length;
        var komitentKonto = "";
        if (sifraLength == 8){ komitentKonto = "20400" + komitentSifra; }
        else if (sifraLength == 9) { komitentKonto = "2040" + komitentSifra; }

        Nalsta.findAll({ where: { konto: rightPad(komitentKonto, 13) }, order: [["datum", "ASC"]] }).then(function (nalsta) {
          if ( nalsta === undefined || nalsta.length == 0 ) { res.send("500"); } 
          else { 
            nsNalsta.findOne({ where: { konto: rightPad(komitentKonto, 13) } }).then(function (nsnalsta) {
              if (nsnalsta) { 
                res.send({ 
                  ime: komitent.naziv.trim(), 
                  sifra: komitent.sifra.trim(),
                  mesto: komitent.mesto.trim(), 
                  adresa: komitent.adresa.trim(),
                  dug: nsnalsta.potrazuje.trim(),
                  konto: nsnalsta.konto.trim(),
                  nalsta: JSON.stringify(nalsta)
                }); 
              }
              else { 
                res.send({ 
                  ime: komitent.naziv.trim(), 
                  sifra: komitent.sifra.trim(),
                  mesto: komitent.mesto.trim(), 
                  adresa: komitent.adresa.trim(),
                  dug: "",
                  konto: nsnalsta.konto.trim(),
                  nalsta: JSON.stringify(nalsta)
                }); 
              }
            });
          };
        })
        .catch(function(err) { res.send("400"); console.log(err); });
      };
    });
  }
});

// AJAX citac search
app.post('/citac/index', function(req, res) {
  var pNumber = req.body.pNumber;
  var mesto = req.body.mesto;
  var adresa = req.body.ulica;
  var naziv = req.body.naziv;
  var orderBy = req.body.orderBy;

  var Op = Sequelize.Op;

  var oS = (pNumber * 10) - 10;

  if (adresa == '' && naziv != '') {
    Komitent.findAll({ where: { mesto: { [Op.substring]: '%'+ upperCase(mesto) +'%' }, naziv: { [Op.substring]: '%'+ upperCase(naziv) +'%' } }, order: [[orderBy, "ASC"]] }).then(function (komitent) {
      if ( komitent === undefined || komitent.length == 0 ) { res.send("500"); } else { res.send({ komitent: JSON.stringify(komitent), pageNumber: 1, os: oS, orderBy: orderBy }); }
    });
  } else if (naziv == '' && adresa != '') {
    Komitent.findAll({ where: { mesto: { [Op.substring]: '%'+ upperCase(mesto) +'%' }, adresa: { [Op.substring]: '%'+ upperCase(adresa) +'%' } } }).then(function (komitent) {
      if ( komitent === undefined || komitent.length == 0 ) { res.send("500"); } else { var pageNumber = komitent.length; }

      Komitent.findAll({ where: { mesto: { [Op.substring]: '%'+ upperCase(mesto) +'%' }, adresa: { [Op.substring]: '%'+ upperCase(adresa) +'%' } }, order: [[orderBy, "ASC"]], offset: oS, limit: 10 }).then(function (komitent) {
        if ( komitent === undefined || komitent.length == 0 ) { res.send("500"); }  else { res.send({ komitent: JSON.stringify(komitent), pageNumber: pageNumber, os: oS, orderBy: orderBy }); }
      });
    });
  } else if (adresa == '' && naziv == '') {
    Komitent.findAll({ where: { mesto: { [Op.substring]: '%'+ upperCase(mesto) +'%' } } }).then(function (komitent) {
      if ( komitent === undefined || komitent.length == 0 ) { res.send("500"); } else { var pageNumber = komitent.length; }

      Komitent.findAll({ where: { mesto: { [Op.substring]: '%'+ upperCase(mesto) +'%' } }, order: [[orderBy, "ASC"]], offset: oS, limit: 10 }).then(function (komitent) {
        if ( komitent === undefined || komitent.length == 0 ) { res.send("500"); } else { res.send({ komitent: JSON.stringify(komitent), pageNumber: pageNumber, os: oS, orderBy: orderBy }); }
      });
    });
  } else {
    Komitent.findAll({ where: { mesto: { [Op.substring]: '%'+ upperCase(mesto) +'%' }, adresa: { [Op.substring]: '%'+ upperCase(adresa) +'%' }, naziv: { [Op.substring]: '%'+ upperCase(naziv) +'%' } } }).then(function (komitent) {
      if ( komitent === undefined || komitent.length == 0 ) { res.send("500"); } else { var pageNumber = komitent.length; }

      Komitent.findAll({ where: { mesto: { [Op.substring]: '%'+ upperCase(mesto) +'%' }, adresa: { [Op.substring]: '%'+ upperCase(adresa) +'%' }, naziv: { [Op.substring]: '%'+ upperCase(naziv) +'%' } }, order: [[orderBy, "ASC"]], offset: oS, limit: 10 }).then(function (komitent) {
        if ( komitent === undefined || komitent.length == 0 ) { res.send("500"); } else { res.send({ komitent: JSON.stringify(komitent), pageNumber: pageNumber, os: oS, orderBy: orderBy }); }
      });
    });
  }
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('404');
});

module.exports = app;
