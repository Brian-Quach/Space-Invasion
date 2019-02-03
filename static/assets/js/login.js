let submitBtn = document.getElementById("submitBtn")
let createBtn = document.getElementById("createBtn")
let nameInput = document.getElementById("nameInput")
let passInput = document.getElementById("passInput")

createBtn.addEventListener("click", function() {
	let name = nameInput.value
	let pass = passInput.value

	getUserFromDb(name, pass).then(function(result) {
		let res = JSON.parse(result)
		if (res.result) {
			// need to start the game
			goToGame()
		} else {
			nameInput.value = ""
			passInput.value = ""
		}
	}).catch(function(error) {
		console.log("error getting user from database");
		console.log(error);
	})
})

submitBtn.addEventListener("click", function() {
	let name = nameInput.value
	let pass = passInput.value

	checkUserExists(name, pass).then(function(result) {
		let res = JSON.parse(result)
		if (res.result) {
			// need to start the game
			goToGame()
		} else {
			nameInput.value = ""
			passInput.value = ""
		}
	}).catch(function(error) {
		console.log("error getting user from database");
		console.log(error);
	})
})


function checkUserExists(username, password) {
	return new Promise(function (resolve, reject) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", '/login', true);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
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


function getUserFromDb(username, password) {
	console.log("getting user from database")
	return new Promise(function (resolve, reject) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", '/create', true);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
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
	window.location.href = './main.html'
}