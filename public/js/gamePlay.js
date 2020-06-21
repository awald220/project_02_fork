let time = 5;
let timer = 10;
const id = setInterval(counterUp, 1000);
let id2;
const gameId = document.getElementById('game-id').textContent;
let userId = localStorage.getItem('userId');
console.log('gameId', gameId);
$('#play-button').on('click', function() {
  counterUp();
});

function counterUp() {
  $('#guessBox').hide();
  const timerDiv = document.querySelector('.timer');
  time -= 1;
  timerDiv.textContent = time;

  // this line applies to the var id code line

  if (time === 0) {
    clearInterval(id);
    $('#promptBox').hide();
    $('#guessBox').show();
    counterUp2();
    id2 = setInterval(counterUp2, 1000);
    $('.timer').hide();
  }
}

function counterUp2() {
  const timerDiv2 = document.querySelector('.timer2');
  timer -= 1;
  timerDiv2.textContent = timer;

  if (timer === 0) {
    clearInterval(id2);
    // $("#userGuess").put("/api/game", { submission: userGuess, gameId: "20", userId: "Ashley" })
    // console.log("I did a put")
    workdangit();
  }
}

function workdangit() {
  userId = localStorage.getItem('userId');
  const userGuess = $('#userGuess')
    .val()
    .trim();
  const newGame = {
    submission: userGuess,
    gameId,
    userId,
  };

  $.ajax('/api/game/', {
    method: 'PUT',
    data: newGame,
  }).then(function(response) {
    console.log(response);
    if (response.done) {
      window.location.href = `/game/${response.done}`;
    }
    console.log(response);
    window.location.href = '/';
  });
}
