var time = 5;

function counterUp(){
    var timerDiv = document.querySelector(".timer")
    timerDiv.textContent = time-=1;

    // this line applies to the var id code line
    if (time === 0){
        clearInterval(id)
    }
}

var id = setInterval(counterUp, 1000)