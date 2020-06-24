const userId = localStorage.getItem('userId');
const name = localStorage.getItem('name');

if (
  userId &&
  name &&
  userId !== 'undefined' &&
  userId !== 'null' &&
  name !== 'undefined' &&
  name !== 'null'
) {
  $('#logged-in-as').text(`Logged in as: ${name}`);
} else {
  $('#logged-in-as').text('You are not logged in!');
  localStorage.clear();
}

$('#play-button').on('click', () => {
  const userId = localStorage.getItem('userId');

  if (userId && userId !== 'undefined' && userId !== 'null') {
    window.location.href = `/play?userId=${userId}`;
  } else {
    $('#logged-in-as').text('You are not logged in!');
  }
});

// Show login modal
$('#login').on('click', event => {
  event.preventDefault();

  $('#login-modal').modal({ show: true });
});

// Show create modal
$('#create').on('click', event => {
  event.preventDefault();

  $('#create-modal').modal({ show: true });
});

// Create new user functionality
// Grab username and password from text fields on index page
// Call /api/users with a POST
$('#create-button').on('click', event => {
  event.preventDefault();

  const username = $('#create-username')
    .val()
    .trim();
  const password = $('#create-password')
    .val()
    .trim();

  if (!username || !password) {
    return alert('you must enter a username and password');
  }

  const newUser = {
    name: username,
    password,
  };

  // Create new user
  $.ajax('/api/users', {
    type: 'POST',
    data: newUser,
  }).then(function(response) {
    if (response.error) {
      return alert('error, please try again');
    }
    if (response.taken) {
      // Notify user that username taken
      document.getElementById('username-taken').style = 'display: block';
    } else {
      // Store user id in local storage
      localStorage.setItem('userId', response.id);
      localStorage.setItem('name', response.name);

      $('#create-modal').modal('hide');

      $('#logged-in-as').text(`Logged in as: ${response.name}`);
    }

    $('#username').val('');
    $('#password').val('');
  });
});

// Log in to existing user
$('#login-button').on('click', event => {
  event.preventDefault();

  const username = $('#login-username')
    .val()
    .trim();
  const password = $('#login-password')
    .val()
    .trim();

  if (!username || !password) {
    return alert('you must enter a username and password');
  }

  const user = {
    name: username,
    password,
  };

  // Log in to existing user
  $.ajax('/api/getuser', {
    type: 'POST',
    data: user,
  }).then(function(response) {
    if (response.error) {
      return alert('there was an error please try again');
    }
    if (response.exists) {
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('name', response.name);

      $('#login-modal').modal('hide');

      $('#logged-in-as').text(`Logged in as: ${response.name}`);
    } else {
      $('#invalid-name').text('Either your username or password was wrong. Please try again.');
    }
  });
});

$("#allGames").on('click', () => {
    window.location.href = `/allgames`;
});