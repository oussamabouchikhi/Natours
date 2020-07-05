const fs = require("fs");
const express = require('express');
const { send } = require("process");
const morgan = require('morgan');

const app = express();

/** 1- Middlewares **/

// Global middlewares used for all requests
app.use(morgan("dev"));
// Middleware to access data from request object
app.use(express.json());
app.use((req, res, next) => {
    console.log("Hello from middleware 🖐");
    next();
});

app.use((req, res, next) => {
    // Add time to the request
    req.requestTime = new Date().toISOString();
    next();
});

// Read tours-simple.json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


/** 2- Route Handlers **/
// Get all tours
const getAllTours = (req, res) => {
    res.status(200).json({
        // Envelop data using JSend format
        status: "success",
        requesteAt: req.requestTime,
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

// Get all users
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not implemented yet!"
    });
}

// Get one user
const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not implemented yet!"
    });    
}

// Update one user
const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not implemented yet!"
    }); 
}

// Delete one user
const deleteUser = (req, res)=>{
    res.status(500).json({
        status: "error",
        message: "This route is not implemented yet!"
    });
}

// Create a new user
const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not implemented yet!"
    });
}

/** 3- Routes **/

const toursRouter = express.Router();
const usersRouter = express.Router();

toursRouter.route("/").get(getAllTours).post(createTour);
toursRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

usersRouter.route("/").get(getAllUsers).post(createUser);
usersRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

// Mounting routers
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);

/** 4- Start server **/
const PORT = 3000;
app.listen(PORT, ()=> console.log(`App running at: localhost:${PORT}`));