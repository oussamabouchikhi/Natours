const fs = require("fs");
const express = require('express');
const { send } = require("process");

const app = express();

// Middleware to get data from request
app.use(express.json());

// Read tours-simple.json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Get all tours
const getAllTours = (req, res) => {
    res
        .status(200)
        .json({
            // Envelop data using JSend format
            status: "success",
            data: {
                tours
            }
        });
    
}

// Get one tour
const getTour = (req, res) => {
    const id = req.params.id * 1; // convert reauest id to number
    const tour = tours.find(tour => tour.id === id);

    // if (id > tours.length) {
    if (!tour) {
        res.status(404).json({
            status: "fail",
            message: "Invalid id"
        });
    }

    res
        .status(200)
        .json({
            status: "success",
            data: {
                tour
            }
        });
    
}

// Update one tour
const updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        res.status(404).json({
            status: "fail",
            message: "Invalid id"
        });
    }
    
    res.status(200).json({
        status: "success",
        data: {
            tour: "<Updated tour here>"
        }
    });
    
}

// Delete one tour
const deleteTour = (req, res)=>{
    const id = req.params.id * 1;
    if (id > tours.length) {
        res.status(404).json({
            status: "fail",
            message: "Invalid id"
        });
    }
    
    res.status(204).json({
        status: "success",
        data: null
    });
    
}

// Create a new tour
const createTour = (req, res)=>{
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
}

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);
// app.post("/api/v1/tours", createTour);

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app.route("/api/v1/tours/:id").get(getTour).patch(updateTour).delete(deleteTour);

const PORT = 3000;
app.listen(PORT, ()=> console.log(`App running at: localhost:${PORT}`));