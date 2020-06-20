const express = require('express');

const app = express();

app.get("/", (req, res)=>{
    res.status(200).json({message: "Hello from the server side!", app: "Natours"});
    
});

app.get("/", (req, res)=>{
    console.log("You can post to this endpoint");
    
});

app.listen(3000, (req, res)=> console.log("App running at: localhost:3000"));