

const dotenv = require('dotenv');
const router = require('./routes/index.routes');
const app = require("./app");


dotenv.config({ path: "./.env" })
app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`server starts on ${PORT} port.`)
})