const express = require('express'); // to import the express module

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {DBConnection} = require('./database/db');
const User = require('./models/User');
dotenv.config();

const app = express(); // creating instance of express application
const PORT = process.env.PORT || 3000; // defining the port for the application


DBConnection();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// use app.get() to configure the route with the path '/' and a callback function
// the callback function receives a req and res objects provided by Express
// req is the incoming request object containing client data, and res is the response object used to send data back to the client

app.get("/", (req, res) => { // GET - if we get any request from user (frontend) using slash '/' we will return "custom" message
    res.status(220); // used to set the HTTP status code before sending the response
    res.send("Hello world!"); // use res.send() to send the response back to the client
}); 

// registration 
    // get data from frontend like name, email, password
    // validate the data, like email format (use REGEX), password minimum length, non-empty fields
    // check if already exists in database
    // hashing/encrypt the password
    // save user in DB
    // generate a token (JWT) for user and send it to them
    // store in cookies like HTTPOnly

app.post("/register", async (req, res) => {

    try {
        const { firstname, lastname, email, password } = req.body;

        if(!firstname || !lastname || !email || !password) { // we need complete info from user so check it
            return res.status(400).send("Please enter all the information.");
        }

        // more validation checks needed, implement them

        const existingUser = await User.findOne({email});
        if(existingUser)
            return res.status(400).send("User with this email already exists!");
        
        // now hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // now saving user in db
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        // generate token and send to user
        const token = jwt.sign({id: user._id, email}, process.env.SECRET_KEY, {
            expiresIn: '2h',
        });

        user.token = token;
        user.password = undefined;
        res.status(200).json({message: "You have successfully registered!", user});
    }
    catch(error) {
        console.log(error);
    };
});


app.listen(PORT, (error) => {
    if(!error)
        console.log("Server is successfully running and app is listening on port "+PORT);
    else
        console.log("Error occured, server can't start", error);
});