const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');

const UserModel = require('../models/UserModel.js');


router.post(
    '/create',                                        // http://localhost:3011/user/create
    async function(req, res) {

        const newDocument = {
            'firstname': req.body.firstname,
            'lastname': req.body.lastname,
            'email': req.body.email,
            'password': req.body.password
        }


        // 1a.  If email is unique
        const dbResult = await UserModel.findOne({email: req.body.email});
        if (dbResult === null) {

            // 2. Generate a hash
            const salt = await bcryptjs.genSalt();
            const hashedPassword = await bcryptjs.hash(req.body.password, salt);

            // 3. Replace the original password with hash
            newDocument.password = hashedPassword;

            // 4. Write credentials in collection
            UserModel
            .create(newDocument)
            .then(                                      // If the 'create' request is successful, then handle it
                function(dbDocument) {
                    res.json( dbDocument );
                }
            )
            .catch(
                function(dbError) {                     // If the 'create' request is unsuccessful, catch the error
                    console.log(dbError);
                    res.send("An error occured");
                }
            );
        }
        // 1b.  If email is NOT unique
        else {
            // 2. Reject the request
            res.send(
                {
                    "message": "not ok",
                    "description": "An account already exists"
                }
            );
        }
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