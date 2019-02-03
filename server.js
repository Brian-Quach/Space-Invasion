const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('static'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
    next();
});


app.put('/newscore', function(req, res) {
    console.log("hi");
    console.log(req.body.score);
});

const PORT = 3000;
app.listen(PORT, () =>{
    console.log("Started server on port", PORT);
});