const fs = require("fs");
const express = require('express');

const app = express();

// Read tours-simple.json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get("/api/v1/tours", (req, res)=>{
    res
        .status(200)
        .json({
            // Envelop data using JSend format
            status: "success",
            data: {
                tours
            }
        });
    
});

const PORT = 3000;
app.listen(PORT, ()=> console.log(`App running at: localhost:${PORT}`));