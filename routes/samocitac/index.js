var express = require('express');
var router = express.Router();
var flash = require('req-flash');
var bodyParser = require('body-parser');
var leftPad = require('left-pad')
var bcrypt = require('bcryptjs');
var rightPad = require('right-pad');
var qr = require('qr-image');
var fs = require('fs');

let Nalsta = require('../../models/nalsta');
let Komitent = require('../../models/komitent');

// Get page
router.get('/', function(req, res, next) {
    if(req.session.komitent){
        if(10000000 < req.session.komitent.sifra && req.session.komitent.sifra < 700000000){
            var konto;
            var ks = req.session.komitent.sifra;
            if(req.session.komitent.sifra > 99999999){
                konto = '2040' + req.session.komitent.sifra;
            } else {
                konto = '20400' + req.session.komitent.sifra;
            }

            Nalsta.findAll({ where: { konto: konto.replace(/ /g,'').trim() }, order: [ [ 'datum', 'ASC' ]] })
                .then(function (nalsta) {
                    if (!nalsta) {
                        if(err) console.log(err);
                        req.flash('danger', 'Greška pri listanju kartice! Pozovite administratora!');
                        res.redirect('samocitac/index');
                    } else {
                        res.render('samocitac/index', { 
                            title: 'JKP', 
                            naziv: req.session.komitent.naziv,
                            sifra: req.session.komitent.sifra,
                            'nalstas': nalsta
                        });
                    }      
                })
                .catch(function(err) { 
                    console.log(err); 
                    req.flash('danger', 'Greška u prijavi!');
                    res.redirect('/login');
                });
        } else { req.flash('danger', 'Nema pravo pristupa!'); res.redirect('/login'); }
    } else { res.redirect('/login'); }
});

router.post('/', function(req, res, next) {
    var stanje = req.body.stanje;
    res.redirect('/samocitac/index');
});

// PDF
router.get('/print/:id', (req, res, next) => {
    if(req.session.komitent){
        if(10000000 < req.session.komitent.sifra && req.session.komitent.sifra < 700000000){
            Nalsta.findOne({ where: { id: req.params.id } }).then(function (nalsta) {
                var konto = nalsta.konto.replace(/\s/g, '');
                var sifra;
                if (konto > 99999999) { sifra = konto.slice(5); } 
                else if (konto <= 99999999) { sifra = konto.slice(6); }
                else {
                    req.flash('danger', 'Konto greška!');
                    res.redirect('/samocitac/index');
                }
                Komitent.findOne({ where: { sifra: rightPad(sifra, 10) } }).then(function (komitent) {
                    console.log(sifra);
                    console.log(konto);
                    if (komitent.naziv != null && nalsta.vrsta == 'D'){
                        // PDF generating
                        var PDFDocument = require('pdfkit');                    
                        doc = new PDFDocument({
                            margin: 40
                        });
                        var dateFormat = require('dateformat');
                        var now = new Date();
                        res.setHeader('Content-disposition', 'filename = ' + komitent.sifra.trim() + '-' + komitent.naziv.trim() + '-' + dateFormat(now, "m-yyyy") +'.pdf');
                        doc.pipe(res); 
        
                        var cKomNaziv = "JKP VODOVOD BEZDAN";
                        var cKomMesto =  "25270 BEZDAN";
                        var cKomAdresa = "Somborski put b.b.";
                        var cKomZiroRacun = "TR1: 200-2825680101040-80 TR2: 160-924754-14 TR3: 355-1002906-59";
                        var cKomTelefon = "Tel/Fax: 025/810-369";
                        var cKomPIB = "PIB: 100613555";
                        var cKomMBR = "MBR: 08189544";
                        var cKomNapomena = "www.vodovodbezdan.com";

                        var normal = "./public/stylesheets/fonts/Times_New_Roman_Normal.ttf";
                        var bold = "./public/stylesheets/fonts/Times_New_Roman_Normal_Bold.ttf";

                        // QR Code generating
                        var svg_string = qr.imageSync(komitent.naziv, { type: 'png' });
                        
                        // QRCode inserting
                        doc.image(svg_string, 300, 100, { fit: [50, 50] });
                    
                        doc.info['Title'] = komitent.sifra.trim() + '-' + komitent.naziv.trim() + '-' + dateFormat(now, "m-yyyy") +'.pdf';
                        doc.fontSize(9);
                        doc.font(bold).text(cKomNaziv + "  " + cKomMesto + "  " + cKomAdresa, 40, 40);
                        doc.font(normal).text(".", 400, 40);
                        doc.font(bold).text(cKomNaziv, 440, 40);
                        doc.font(normal).text(cKomNapomena + "  " + cKomTelefon + "  " + cKomPIB + "  " + cKomMBR, 40, 52);
                        doc.text(".", 400, 52);
                        doc.text(cKomMesto, 440, 52);
                        doc.text(cKomZiroRacun, 40, 64);
                        doc.text(".", 400, 64);
                        doc.font(bold).text(cKomNapomena, 440, 64);
                        var dateFormat = require('dateformat');
                        var now = new Date();
                        doc.font(normal).text("Datum i mesto prometa dobara: " + dateFormat(nalsta.datum, "dd.mm.yyyy.") + ", " + cKomMesto, 40, 76);
                        doc.text(".", 400, 76);
                        doc.font(bold).text("Datum i mesto izdavanja računa: " + dateFormat(nalsta.datum, "dd.mm.yyyy.") + ", " + cKomMesto, 40, 88);
                        doc.text(".", 400, 88);
                        doc.text("Izveštaj o uplati mesec " + dateFormat(now, "m / yyyy"), 440, 88);
                        doc.text(".", 400, 100);
                        doc.font(bold).text("Račun " + nalsta.racun.replace(/\s/g, '') + "-" + sifra + " za mesec " + dateFormat(now, "m / yyyy") + "  Platiti do: " + dateFormat(nalsta.valuta, "dd.mm.yyyy."), 40, 112);
                        doc.font(normal).text(".", 400, 112);
                        doc.text("Iznos: ", 440, 112);
                        doc.text(".", 400, 124);
                        if (nalsta.saldo < nalsta.duguje) { doc.font(bold).text("Pretplata - Hvala!", 480, 124); }
                        else { doc.font(normal).text(nalsta.duguje, 480, 124); }
                        doc.text(komitent.naziv.trim() + "    " + komitent.sifra.replace(/\s/g, ''), 40, 136);
                        doc.font(normal).text(".", 400, 136);
                        doc.text(komitent.mesto.trim() + "    " + komitent.adresa.trim(), 40, 148);
                        doc.text(".", 400, 148);
                        doc.text("Sif.pla.   Tekući racun", 440, 148);
                        doc.text("Stanje vodomera Sada: " + nalsta.sada.trim() + "  " + "Pre: " + nalsta.prethodno.trim(), 40, 160);
                        doc.text(".", 400, 160);
                        doc.font(bold).text("189", 445, 160);
                        doc.text(cKomZiroRacun.slice(5, 25), 475, 160)
                        doc.font(normal).text("RBr    Opis                      jm     Količina     VpCena    PDV%   VpVrednost", 40, 172, { underline: true });
                        doc.text(".", 400, 172);
                        doc.text("1.  Utrošak vode             m3     10,000          " + (nalsta.sada - nalsta.prethodno) + "       10,00      " + Number((nalsta.sada - nalsta.prethodno) * nalsta.cena).toFixed(2), 40, 184);
                        doc.text(".", 400, 184);
                        doc.text("Model     Poziv na broj", 440, 184)
                        doc.text("2.  Troškovi obračuna  kom      1,000        " + (nalsta.trobracuna) + "       20,00      " + nalsta.trobracuna.trim(), 40, 196);
                        doc.text(".", 400, 196);
                        doc.font(bold).text("97          " + Number(98 - ((sifra % 97) * 100) % 97).toFixed(0) + "-" + sifra, 445, 196);
                        doc.text("Osnovica10%    PDV10%  Osnovica20%  PDV20%   Za Uplatu po računu", 40, 208, { underline: true });
                        doc.font(normal).text(".", 400, 208);
                        doc.text(Number((nalsta.sada - nalsta.prethodno) * nalsta.cena).toFixed(2) + "    +    " + nalsta.pdvposebna + "    +    " + nalsta.trobracuna + "      +      " + nalsta.pdvopsta + "        =         " + nalsta.duguje, 55, 220);
                        doc.text(".", 400, 220);
                        doc.text("Uplatilac:  " + sifra, 440, 220);
                        doc.text(".", 400, 232);
                        doc.text(komitent.naziv.trim(), 440, 232);
                        doc.font(bold).text("Stanje sa uplatama do " + dateFormat(nalsta.datum, "dd.mm.yyyy.") + "        Pretplata:   " + nalsta.saldo, 40, 244);
                        doc.font(normal).text(".", 400, 244);
                        doc.text(komitent.mesto.trim(), 440, 244);
                        if (nalsta.saldo < nalsta.duguje) { doc.text(" Hvala što redovno izmirujete obaveze!", 40, 256); }
                        doc.text(".", 400, 256);
                        doc.text(komitent.adresa.trim(), 440, 256);

                        doc.end();
                    } else {
                        req.flash('danger', 'Greška!'); // Komitent neve nincs meg
                        res.redirect('/samocitac/index');
                    }
                });
            });
        } else { req.flash('danger', 'Nemate pravo pristupa!'); res.redirect('/login'); }
    } else { res.redirect('/login'); }
});

module.exports = router;