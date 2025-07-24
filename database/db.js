const mongoose = require('mongoose'); // importing mongoose - ODM library
const dotenv = require('dotenv'); // to load environment variables from .env file to process.env
dotenv.config(); // needed to access sensitive data like MongoDB URLs, API keys securely from environment variables

const DBConnection = async () => { // this asynchronous function is called to connect our app to MongoDB database
    const MONGO_URI = process.env.MONGODB_URL;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB connection established.");
    }
    catch (error) {
        console.log("Error establishing connection to MongoDB: ", error);
    }
};

module.exports = { DBConnection };