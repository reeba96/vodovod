var express = require('express');
var fs = require('fs');
var router = express.Router();

// Dokumenti strana
router.get('/', function(req, res, next) {
  var directoryJavneNabavke     = './public/files/javneNabavke/';
  var directoryIzvestaji        = './public/files/izvestaji/';
  var directoryOsnovniDokumenti = './public/files/osnovniDokumenti/';
  var directoryRadneBiografije  = './public/files/radneBiografije/';

  var fileTypeJavneNabavke = [];
  var fileTypeIzvestaji = [];
  var fileTypeOsnovniDokumenti = [];
  var fileTypeRadneBiografije = [];

  // Javne nabavke kiolvasasa
  fs.readdir(directoryJavneNabavke, (err, filesJavneNabavke) => {
    filesJavneNabavke.forEach(file => {  
        var JavnaNabavkaFileNameBackway = file.split("").reverse().join("");
        var JavnaNabavkaFileExtensionBackway = JavnaNabavkaFileNameBackway.split(".");
        var JavnaNabavkaFileExtensionFrontWay = JavnaNabavkaFileExtensionBackway[0].split("").reverse().join("");
        fileTypeJavneNabavke.push(JavnaNabavkaFileExtensionFrontWay);
    });

    if (filesJavneNabavke.length == 0) { filesJavneNabavke[0] = "Nema podataka"; }

    // Izvestaji kiolvasasa
    fs.readdir(directoryIzvestaji, (err, filesIzvestaji) => {
        filesIzvestaji.forEach(file => {  
            var IzvestajFileNameBackway = file.split("").reverse().join("");
            var IzvestajFileExtensionBackway = IzvestajFileNameBackway.split(".");
            var IzvestajFileExtensionFrontWay = IzvestajFileExtensionBackway[0].split("").reverse().join("");
            fileTypeIzvestaji.push(IzvestajFileExtensionFrontWay);
        });
    
        if (filesIzvestaji.length == 0) { filesIzvestaji[0] = "Nema podataka"; }

        // Osnovni dokumenti kiolvasasa
        fs.readdir(directoryOsnovniDokumenti, (err, filesOsnovniDokumenti) => {
            filesOsnovniDokumenti.forEach(file => {  
                var OsnovniDokumentFileNameBackway = file.split("").reverse().join("");
                var OsnovniDokumentFileExtensionBackway = OsnovniDokumentFileNameBackway.split(".");
                var OsnovniDokumentFileExtensionFrontWay = OsnovniDokumentFileExtensionBackway[0].split("").reverse().join("");
                fileTypeOsnovniDokumenti.push(OsnovniDokumentFileExtensionFrontWay);
            });
        
            if (filesOsnovniDokumenti.length == 0) { filesOsnovniDokumenti[0] = "Nema podataka"; }
        
            // Radne biografije kiolvasasa
            fs.readdir(directoryRadneBiografije, (err, filesRadneBiografije) => {
                filesRadneBiografije.forEach(file => {  
                    var RadnaBiografijaFileNameBackway = file.split("").reverse().join("");
                    var RadnaBiografijaFileExtensionBackway = RadnaBiografijaFileNameBackway.split(".");
                    var RadnaBiografijaFileExtensionFrontWay = RadnaBiografijaFileExtensionBackway[0].split("").reverse().join("");
                    fileTypeRadneBiografije.push(RadnaBiografijaFileExtensionFrontWay);
                });
            
                if (filesRadneBiografije.length == 0) { filesRadneBiografije[0] = "Nema podataka"; }
            
                res.render('dokumenti', {
                  title: 'Dokumenti',
                  'filesJavneNabavke': filesJavneNabavke.reverse(),
                  'filesIzvestaji': filesIzvestaji.reverse(),
                  'filesOsnovniDokumenti': filesOsnovniDokumenti.reverse(),
                  'filesRadneBiografije': filesRadneBiografije,
                  'fileTypeJavneNabavke' : fileTypeJavneNabavke.reverse(),
                  'fileTypeIzvestaji' : fileTypeIzvestaji.reverse(),
                  'fileTypeOsnovniDokumenti' : fileTypeOsnovniDokumenti.reverse(),
                  'fileTypeRadneBiografije' : fileTypeRadneBiografije,
                  arrayLengthJavneNabavke: filesJavneNabavke.length,
                  arrayLengthIzvestaji: filesIzvestaji.length,
                  arrayLengthOsnovniDokumenti: filesOsnovniDokumenti.length,
                  arrayLengthRadneBiografije: filesRadneBiografije.length
                });
        
            });
    
        });

    });

  });

}); // END router.get

module.exports = router;