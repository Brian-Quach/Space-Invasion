let myTurnDiv = document.getElementById("myGames")
let theirTurnDiv = document.getElementById("theirGames")
let onePlayer = document.getElementById("onePlayer")

let searchStr = window.location.search
let user1pos = searchStr.search("user1") + 6

let user1 = ""
char = ''
while (char != '&' && user1pos < searchStr.length + 1) {
	user1 += char
	char = searchStr[user1pos]
	user1pos += 1
}

console.log("user:")
console.log(user1)


onePlayer.addEventListener("click", function() {
	goToGame(user1, "none")
})

httpGetAsync('/user/' + window.localStorage.getItem('currentUser'), function(res, err){
    console.log(res);
    res = JSON.parse(res);
    document.getElementById("total").innerHTML = 'Total Balance: ' + (res.balance == null ? 0 : res.balance);
    document.getElementById("score").innerHTML = 'Last Game Score: ' + (res.recentScore == null ? 0 : res.recentScore);
});

getGamesFromDb(user1).then(function(result) {
	let res = JSON.parse(result)
	let games = res.games;

	for (let i = 0; i < games.length; i++) {
		if ((games[i].turn == 0 && games[i].user1 == user1) || (games[i].turn == 1 && games[i].user2 == user1)) {
			console.log("my turn")

			let newButton = document.createElement('button')

			if (user1 == games[i].user1) {
				newButton.innerHTML = "VS: " + games[i].user2
				newButton.addEventListener("click", function() {
					console.log("button clicked")
					goToGame(user1, games[i].user2)
				})
			} else {
				newButton.innerHTML = "VS: " + games[i].user2
				newButton.addEventListener("click", function() {
					console.log("button clicked")
					goToGame(user1, games[i].user1)
				})
			}

			myTurnDiv.appendChild(newButton)
		} else {
			console.log("not my turn")
			let newButton = document.createElement('h3')

			if (user1 == games[i].user1)
				newButton.innerHTML = "VS: " + games[i].user2
			else {
				newButton.innerHTML = "VS: " + games[i].user2
			}

			theirTurnDiv.appendChild(newButton)
		}
	}

	if (res.result) {



		// need to start the game
		//goToGame()
	} else {
		console.log("here")
	}
}).catch(function(error) {
	console.log("error getting user from database");
	console.log(error);
})

function getGamesFromDb(username) {
	console.log("getting user from database")
	return new Promise(function (resolve, reject) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", '/homeGames', true);
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
        let body = {"username": username}
        console.log("sending")
        xmlHttp.send(JSON.stringify(body));
    });
}

function goToGame(me, them) {
	searchStr = "?user1=" + me + "&user2=" + them
	window.location.href = './main.html' + searchStr
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

