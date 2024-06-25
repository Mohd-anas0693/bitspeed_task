const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Contact = sequelize.define("Contact", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: DataTypes.ENUM,
        values: ['primary', 'secondary'],
        allowNull: false,
    },

}, {
    timestamps: true,
    deletedAt: true,
});
(async () =>{await sequelize.sync()})();

module.exports = Contact;