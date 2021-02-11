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
var Hlp = sequelize.define('hlp', {
    lang_id: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
        primaryKey: true
    },
    help_id: {
        type: Sequelize.STRING, 
        unique: false,
        allowNull: false,
        primaryKey: true
    },
    hint: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    descript: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    datum: {
        type: Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    arhiv: {
        type: Sequelize.NUMBER,
        unique: false,
        allowNull: false
    }
});

module.exports = Hlp;