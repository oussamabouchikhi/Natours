const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require("./index");
dotenv.config({path: './config.env'});

/** Connect to DB **/
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected successfully to DB'));

/** Start server **/
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`App running at: localhost:${PORT}`));
