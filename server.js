const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require("./index");

// console.log(process.env);

/** Start server **/
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`App running at: localhost:${PORT}`));
