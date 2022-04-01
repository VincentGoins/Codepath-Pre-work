/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */
//Global Variables
var pattern = [3, 2, 4, 3, 1, 1, 3, 2];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0 and 1
const clueHoldTime = 600;
const cluePauseTime = 200; //how long to pause in between clues
const nextClueWaitTime = 600; /*how long to wait before starting 
playback of the clue sequence*/
var guessCounter = 0;

function startGame() {
  //initialize gaming variables
  progress = 0;
  gamePlaying = true;
  //swap the Start and Stop buttons
  document.getElementById("StartButton").classList.add("hide");
  document.getElementById("StopButton").classList.remove("hide");
  playClueSequence();
}

function stopGame() {
  //initialize gaming variables
  gamePlaying = false;
  //swap the Start and Stop buttons
  document.getElementById("StartButton").classList.remove("hide");
  document.getElementById("StopButton").classList.add("hide");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 400,
  4: 300,
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(button) {
 document.getElementById("Button"+button).classList.add("lit");
}

function clearButton(button) {
 document.getElementById("Button"+button).classList.remove("lit");
}

function playSingleClue(button) {
  if (gamePlaying) {
    lightButton(button);
    playTone(button, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, button);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
alert("You Lost");
}

function winGame() {
  stopGame();
  alert("You Won. Congrats!!");
}

function guess(button) {
  console.log("User guessed" + button);
  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == button) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } 
      else {
        progress++;
        playClueSequence();
      }
    } 
    else {
      guessCounter++;
    }
  } 
  else {
    loseGame();
  }
}
