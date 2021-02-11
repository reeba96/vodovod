var Sequelize = require('sequelize');
require('dotenv').config();

// Create connection
var sequelize = new Sequelize('postgres://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME, {
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

// Fields
var nsNalsta = sequelize.define('nsnalsta', {
    vrsta: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    nalog: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    konto: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    mtnt: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    racun: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    datum: {
        type: Sequelize.DATE,
        unique: false,
        allowNull: true
    },
    valuta: {
        type: Sequelize.DATE,
        unique: false,
        allowNull: true
    },
    opis: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    protukonto: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    duguje: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    potrazuje: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    saldo: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    oznaka: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    knjizen: {
        type: Sequelize.DATE,
        unique: false,
        allowNull: true
    },
    sada: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    prethodno: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    subvencija: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    cena: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    trobracuna: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    pdvopsta: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    pdvposebna: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    sadsamocit: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    datsamocit: {
        type: Sequelize.DATE,
        unique: false,
        allowNull: true
    },
    sadcitac: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    datcitac: {
        type: Sequelize.DATE,
        unique: false,
        allowNull: true
    },
    sifcitac: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    prosek: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: true
    },
    id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = nsNalsta;