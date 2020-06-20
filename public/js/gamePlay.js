
var time = 3;
var timer = 3;
var id = setInterval(counterUp, 1000);
var id2;
var gameId = document.getElementById("game-id").textContent;
var userId = localStorage.getItem("userId");
console.log("gameId",gameId);
$("#play-button").on("click", function () {

	counterUp();

});


function counterUp() {
	$("#guessBox").hide();
	var timerDiv = document.querySelector(".timer");
	timerDiv.textContent = time -= 1;

	// this line applies to the var id code line

	if (time === 0) {

		clearInterval(id);
		$("#promptBox").hide();
		$("#guessBox").show();
		counterUp2();
		id2 = setInterval(counterUp2, 1000);
		$(".timer").hide();


	}

}


function counterUp2() {

	var timerDiv2 = document.querySelector(".timer2");
	timerDiv2.textContent = timer -= 1;

	if (timer === 0) {
		clearInterval(id2);
		//$("#userGuess").put("/api/game", { submission: userGuess, gameId: "20", userId: "Ashley" })
		//console.log("I did a put")
		workdangit();

	}

}

function workdangit() {
	userId = localStorage.getItem("userId");
	var userGuess = $("#userGuess").val().trim();
	var newGame = {
		submission: userGuess,
		gameId: gameId,
		userId: userId
	};

	$.ajax("/api/game/", {
		method: "PUT",
		data: newGame,

	}).then(function(response){
		console.log(response);
		if(response.done){
			window.location.href = "/game/"+response.done;
		}
		console.log(response);
		window.location.href = "/";
	});
}



