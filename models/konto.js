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
var Konto = sequelize.define('konto', {
    konto: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
        primaryKey: true
    },
    tip: {
        type: Sequelize.STRING, 
        unique: false,
        allowNull: false
    },
    opis: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    aktivapocs: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    pasivapocs: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    aktiva: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    pasiva: {
        type: Sequelize.DOUBLE,
        unique: false,
        allowNull: false
    },
    napomena: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    }
});

module.exports = Konto;