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

var admin = require("firebase-admin");

var serviceAccount = require("pkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mchacks6-4f2f0.firebaseio.com"
});

let db = admin.firestore()


let user = null;


app.put('/login', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	db.collection("users").add({
	    "username": username,
	    "password": password,
	})
	.then(function(docRef) {
	    console.log("Document written with ID: ", docRef.id);
	    res.status(200).send({"result": true})
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});
})

app.get('/game', function(req, res) {

})


app.get('/gamer', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static/main.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log("Started server on port", PORT);
});
/*
var http = require('http');
var fs = require('fs');

var port = process.env.PORT || 1337;

var server = http.createServer(function(request, response) {
	fs.readFile('static/index.html', function (err, data){
		if (err) {
			console.log("ERROR")
			console.log(err)
		} else {
			response.writeHead(200, {'Content-Type': 'text/html'});
        	response.write(data);
        	response.end();
		}
    });


    response.writeHead(200, {"Content-Type": "text/html"});
    response.end("<p>Hello World!</p><p>hiiiii</p>");

}).listen(port);


console.log("Server running at http://localhost:%d", port);*/
