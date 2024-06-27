const { Sequelize } = require('sequelize');

const connectionString = process.env.DB_SECRET;
const sequelize = new Sequelize(connectionString, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // You can set this to true if you have valid certificates
        }
    }
});


sequelize.authenticate().then(() => {
    console.log("Database Connection sucessfull")
}).catch((err) => {
    console.log("connection failed: ", err)
})

module.exports = sequelize;  