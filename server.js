/*
 * Import the libraries
 * -----------------------------------------------------------------------------
 */
// Import the express function
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db_url = "";


const UserModel = require('./models/UserModel.js');

const userRoutes = require('./routes/user-routes.js');


// Calling the express function will return an object
// with all of the methods for handling HTTP
const server = express();

// Configure express
const bodyParserConfig = {extended: false};
server.use( bodyParser.urlencoded(bodyParserConfig) )
server.use( bodyParser.json() );


// Connect to MongoDB via mongoose
db_config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose
.connect(db_url, db_config)                         // Try to connect to MongoDB
.then(                                              // If successful, then console.log()
    function() {    
        console.log("DB is connected")
    }
)
.catch(                                             // If not successful, catch the error
    function(dbError) {
        console.log('db error', dbError)
    }
);

/*
 * Create the routes
 * -----------------------------------------------------------------------------
 */
// Example route
server.get(
    '/',                                // http://localhost:3011/
    function(req, res){                 // Callback function to handle request
        res.send("<h1>Hello!</h1>");
    }
);


const userRoutes = require('./routes/user-routes.js');

server.use(
    '/user',                // http://localhost:3011/user/
    userRoutes
);


/*
 * Listen to port on host
 * -----------------------------------------------------------------------------
 */
// Note:
// Do not create any routes after .listen()
server.listen(
    3011,
    function() {
        console.log('Server is running at http://localhost:3011')
    }
);