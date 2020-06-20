$("#play-button").on("click",()=>{
	
	var userId = localStorage.getItem("userId");

	if(userId){
		window.location.href = "/play?userId=" + userId;
	} else{
		$("#logged-in-as").text("You are not logged in!")
	}
});

// Show login modal
$("#login").on("click", (event)=> {
	event.preventDefault();

	$("#login-modal").modal({show: true});
});

// Show create modal
$("#create").on("click", (event)=> {
	event.preventDefault();

	$("#create-modal").modal({show: true});
});

// Create user functionality
// Grab username and password from text fields on index page
// Call /api/users with a POST
$("#create-button").on("click", (event)=>{
	event.preventDefault();

	var username = $("#create-username").val().trim();
	var password = $("#create-password").val().trim();

	var newUser = {
		name: username,
		password: password
	};

	$.ajax("/api/users", {
		type: "POST",
		data: newUser
	}).then(
		function (response) {
			if (response.taken) {
				// Notify user that username taken
				document.getElementById("username-taken").style = "display: block";
			} else {
				// Store user id in local storage
				localStorage.setItem("userId",response.id);
				console.log(localStorage.getItem("userId"));

				$("#create-modal").modal("hide");
				
				$("#logged-in-as").text(`Logged in as: ${response.name}`);
			}

			$("#username").val("");
			$("#password").val("");
		}
	);


});

$("#login-button").on("click", (event)=>{
	event.preventDefault();

	var username = $("#login-username").val().trim();
	var password = $("#login-password").val().trim();
	console.log(username)

	var user = {
		name: username,
		password: password
	};
	console.log(user)

	$.ajax("/api/getuser", {
		type: "POST",
		data: user
	}).then(
		function(response){
			if(response.exists){
				localStorage.setItem("userId",response.id);
				console.log(localStorage.getItem("userId"));

				$("#login-modal").modal("hide");
				
				$("#logged-in-as").text(`Logged in as: ${response.name}`);
			} else {
				$("#invalid-name").text("Username does not exist.")
			}
			console.log(response)
		}
	)


})

