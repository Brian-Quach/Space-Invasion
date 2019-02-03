let submitBtn = document.getElementById("submitBtn")
let createBtn = document.getElementById("createBtn")
let nameInput = document.getElementById("nameInput")
let passInput = document.getElementById("passInput")

let mainName = null;

createBtn.addEventListener("click", function() {
	let name = nameInput.value
	let pass = passInput.value

	mainName = name

	getUserFromDb(name, pass).then(function(result) {
		let res = JSON.parse(result)
		if (res.result) {
			// need to start the game
            window.localStorage.setItem('currentUser', name);
            goToGame();
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

	mainName = name

	checkUserExists(name, pass).then(function(result) {
		let res = JSON.parse(result)
		if (res.result) {
			// need to start the game
            window.localStorage.setItem('currentUser', name);
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
        console.log("sending request")
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
	searchStr = "?user1=" + mainName
	window.location.href = './home.html' + searchStr
}