const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME;
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const sequelize = new Sequelize(
    {
        dialect: 'postgres',
        host: 'localhost',
        port: '5432',
        username: db_username,
        password: db_password,
        database: dbName
    }
)


sequelize.authenticate().then(() => {
    console.log("Database Connection sucessfull")
}).catch((err) => {
    console.log("connection failed: ", err)
})

module.exports = sequelize; 