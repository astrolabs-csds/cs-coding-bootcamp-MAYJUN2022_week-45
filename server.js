/*
 * Import the libraries
 * -----------------------------------------------------------------------------
 */
// Import the express function
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');
require('dotenv').config();
const db_url = process.env.DB_URL;

const UserModel = require('./models/UserModel.js');

const userRoutes = require('./routes/user-routes.js');


// Calling the express function will return an object
// with all of the methods for handling HTTP
const server = express();


// --------- Start of PassportJS configuration ---------
// Use passport, passport-jwt to read the client jwt
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecret = process.env.JWT_SECRET;

const passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
}

// This function will tell passport how what to do
// with the payload.
const passportJwt = (passport) => {
    passport.use(
        new JwtStrategy(
            passportJwtOptions,
            (jwtPayload, done) => {

                // Tell passport what to do with payload
                UserModel
                .findOne({ _id: jwtPayload._id })
                .then(
                    (dbDocument) => {
                        // The done() function will pass the 
                        // dbDocument to Express. The user's 
                        // document can then be access via req.user
                        return done(null, dbDocument)
                    }
                )
                .catch(
                    (err) => {
                        // If the _id or anything is invalid,
                        // pass 'null' to Express.
                        if(err) {
                            console.log(err);
                        }
                        return done(null, null)
                    }
                )

            }
        )
    )
};
passportJwt(passport)
// ---------End of Passport JS configuration ---------

// Configure express
const bodyParserConfig = {extended: false};
server.use( bodyParser.urlencoded(bodyParserConfig) )
server.use( bodyParser.json() );
server.use( cors() )

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