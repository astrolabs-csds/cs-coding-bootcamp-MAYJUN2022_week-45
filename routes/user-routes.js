const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const UserModel = require('../models/UserModel.js');


router.post(
    '/create',                                        // http://localhost:3011/user/create
    function(req, res) {

        const newDocument = {
            'firstname': req.body.firstname,
            'lastname': req.body.lastname,
            'email': req.body.email
        }

        UserModel
        .create(newDocument)
        .then(                                      // If the 'create' request is successful, then handle it
            function(dbDocument) {
                res.send( dbDocument );
            }
        )
        .catch(
            function(dbError) {                     // If the 'create' request is unsuccessful, catch the error
                console.log(dbError);
                res.send("An error occured");
            }
        );
    }
);


router.get(
    '/find',
    function(req, res) {

        UserModel
        .find()
        .then(
            function(dbResponse) {
                res.send(dbResponse);
            }
        )
        .catch(
            function(dbError){
                console.log(dbError);
                res.send('An error occured');
            }
        )

    }
);

module.exports = router;