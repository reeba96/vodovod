var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
require('dotenv').config();

// Create connection
var sequelize = new Sequelize('postgres://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME, {
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

// Fields
var Komitent = sequelize.define('komitent', {
    sifra: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    naziv: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    adresa: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    mesto: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    adresarac: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    mestorac: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    tel: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    tel2: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    fax: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    osoba: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    ziro: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    ziro2: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    ziro3: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    ziro4: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    ziro5: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    ziro6: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    ziro7: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    ziro8: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    matbr: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    regbr: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    delatnost: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    konto: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    pib: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    odobrenje: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    napomena: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    otpremio: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    rabatmarza: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    updvsis: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    valuta: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    mes01: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes02: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes03: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes04: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes05: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes06: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes07: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes08: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes09: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes10: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes11: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    mes12: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    lozinka: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Komitent.prototype.validPassword = function(lozinka, hash){
    return bcrypt.compareSync(lozinka, hash);
}
module.exports = Komitent;