const fs = require("fs");
const express = require('express');
const { send } = require("process");

const app = express();

// Middleware to get data from request
app.use(express.json());

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

app.post("/api/v1/tours", (req, res)=>{
    // Generate new tour id from last tour id + 1 
    const newId = tours[tours.length -1].id + 1;
    // Merge id with data from req in 1 object
    const newTour = Object.assign({id: newId}, req.body);

    // ADD NEW item to tours array then convert it to json then add it to tours file
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, err => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    
    });
    res.send("Tour created successfully");
});

const PORT = 3000;
app.listen(PORT, ()=> console.log(`App running at: localhost:${PORT}`));