var val = $('#promptBox').text().trim();
console.log(val)

var wordCount = val.split(" ").length;
console.log(val.split(" "))

// time to read, write
let readTime = Math.ceil(wordCount * .25)
let writeTime = Math.ceil(wordCount * .5)
$('#guessBox').hide();
const readId = setInterval(readCounter, 1000);
let writeId;
const gameId = document.getElementById('game-id').textContent;
    


$('#play-button').on('click', function() {
  readCounter();
});

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
  const userId = localStorage.getItem('userId');
  const userGuess = $('#userGuess')
    .val()
    .trim();

  if (!userId || userId === 'undefined' || userId === 'null') {
    return alert('sorry, could not be submitted');
  }
  if (!userGuess || userGuess.length < 5) {
    return alert('bad response');
  }

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
