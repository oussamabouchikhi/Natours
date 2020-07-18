const app = require("./index");

/** Start server **/
const PORT = 3000;
app.listen(PORT, ()=> console.log(`App running at: localhost:${PORT}`));
