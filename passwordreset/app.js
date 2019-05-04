const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));


app.listen(3000, function() {
    console.log('Node started on port 3000!')
});