const val = $('#promptBox')
  .text()
  .trim();
console.log(val);

const wordCount = val.split(' ').length;
console.log(val.split(' '));

// time to read, write
let readTime = Math.ceil(wordCount * 0.2);
let writeTime = Math.ceil(wordCount * 0.75);
$('#guessBox').hide();

let writeId;
let readId;

const gameId = document.getElementById('game-id').textContent;

const userIds = document.getElementById('user-ids').textContent;

const userId = localStorage.getItem('userId');

console.log(gameId, userIds, userId);

const alreadyPlayed = localStorage.getItem(gameId) === 'done';
localStorage.setItem(gameId, 'done');

if (userIds.split(',').includes(userId) || alreadyPlayed) {
  window.location.href = `/`;
} else {
  readId = setInterval(readCounter, 1000);
}

function readCounter() {
  const timerDiv = document.querySelector('.timer');
  readTime -= 1;
  timerDiv.textContent = readTime;

  if (readTime < 1) {
    clearInterval(readId);

    $('#promptBox').hide();

    $('#guessBox').show();
    // counterUp2();
    writeId = setInterval(writeCounter, 1000);
    $('.timer').hide();
  }
}

function writeCounter() {
  const timerDiv2 = document.querySelector('.timer2');
  writeTime -= 1;
  timerDiv2.textContent = writeTime;

  if (writeTime < 1) {
    clearInterval(writeId);
    postGuess();
  }
}

function postGuess() {
  const userGuess = $('#userGuess')
    .val()
    .trim();

  if (!userId || userId === 'undefined' || userId === 'null') {
    return alert('sorry, could not be submitted');
  }
  // if (!userGuess || userGuess.length < 5) {
  //   return alert('bad response');
  // }

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
    if (response.error) {
      return alert('something went wrong');
    }
    if (response.done) {
      window.location.href = `/game/${response.done}`;
    } else {
      window.location.href = '/';
    }
  });
}
