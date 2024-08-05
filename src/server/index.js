const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));

//GET routes


// POST Routes


// Designates what port the app will listen to for incoming requests
app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
});


