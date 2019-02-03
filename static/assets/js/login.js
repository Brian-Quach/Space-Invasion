let submitBtn = document.getElementById("submitBtn")
let nameInput = document.getElementById("nameInput")
let passInput = document.getElementById("passInput")

submitBtn.addEventListener("click", function() {
	console.log("button clicked")
	let name = nameInput.value
	let pass = passInput.value

	goToGame()

/*	getUserFromDb(name, pass).then(function(result) {
		let res = JSON.parse(result)
		if (res.result) {
			// need to start the game
			startGame()
		} else {
			nameInput.value = ""
			passInput.value = ""
		}
	}).catch(function(error) {
		console.log("error getting user from database");
		console.log(error);
	}) */
})

function getUserFromDb(username, password) {
	console.log("getting user from database")
	return new Promise(function (resolve, reject) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", '/login', true);
        xmlHttp.onload = function () {
            if (this.status == 200) {
                resolve(xmlHttp.responseText);
            } else {
                reject({
                    status: this.status,
                    statusText: xmlHttp.statusText
                });
            }
        };
        xmlHttp.onerror = function () {
            reject({
                status: this.status,
                statusText: xmlHttp.statusText
            });
        };

        let body = {"username": username, "password": password}

        xmlHttp.send(JSON.stringify(body));
    });
}

function startGame() {
	return new Promise(function (resolve, reject) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", '/game', true);
        xmlHttp.onload = function () {
            if (this.status == 200) {
                resolve(xmlHttp.responseText);
            } else {
                reject({
                    status: this.status,
                    statusText: xmlHttp.statusText
                });
            }
        };
        xmlHttp.onerror = function () {
            reject({
                status: this.status,
                statusText: xmlHttp.statusText
            });
        };

        xmlHttp.send();
    });
}

function goToGame() {
	console.log("this")
	window.location.href = './main.html'
}