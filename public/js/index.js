$("#play-button").on("click",()=>{
	window.location.href = "/play?userId=jacob";
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