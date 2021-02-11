var fs = require('fs');

var methods = {
  languagePicker: function(lang_id) {
    let Help = require('./models/help');
	  Help.findAll({ where: { lang_id: lang_id } }).then(function (help) {
	    return help;
	  });
  }
};

exports.data = methods;