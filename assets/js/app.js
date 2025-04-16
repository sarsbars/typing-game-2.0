'use strict';
import * as utils from "./utils.js";
import { Score } from './score.js'; 

import words from './words.js';

const button = utils.select('.start-restart');
const countdownDisplay = utils.select('.countdown');
const userInput = utils.select('.user-input');
const currentWordDisplay = utils.select('.current-word');
const startButton = utils.select('.start-restart');
const hitCounterDisplay = utils.select('.hit-counter'); 
const catImage = utils.select('.cat-image');


let timeLeft = 100; 
let currentWord = '';
let hits = 0;
let countdownInterval = null; 
let gameStarted = false; 
let wordList = [];
const backgroundMusic = new Audio("./assets/media/background.mp3");

function getDate() {
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    };
}


function startCountdown() {
    if (countdownInterval !== null) {
      clearInterval(countdownInterval);
    }
  
    timeLeft = 100; 
  
    countdownInterval = setInterval(() => {
      if (timeLeft >= 0) {
        countdownDisplay.textContent = timeLeft; 
        timeLeft--;
      } else {
        endGame();
        countdownDisplay.textContent = "Time's up!";
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

function startGame() {
    gameStarted = true;
    startCountdown();
    backgroundMusic.play();

    wordList = [...words]; 
    wordList.sort(() => Math.random() - 0.5); 
    currentWord = wordList[wordList.length - 1];
    wordList.pop();

    currentWordDisplay.textContent = currentWord; 
    userInput.value = '';
    userInput.focus();
    userInput.placeholder = "Enter word here";
    
    hits = 0; 
    hitCounterDisplay.textContent = `${hits} Hits`;

    startButton.textContent = "Restart";
    updateCatImage();
}

function resetGame() {
    clearInterval(countdownInterval);
    countdownDisplay.textContent = '- - -';
    userInput.value = '';
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    startGame();
}

function endGame() {
    gameStarted = false;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    startButton.textContent = "Restart";
    const finalScore = new Score(hits);
    console.log("Final Score:", finalScore);
}

function getNextWord() {
    if (wordList.length > 0) {
        currentWord = wordList[wordList.length - 1];
        currentWordDisplay.textContent = currentWord;
        wordList.pop();
        userInput.value = '';
    } else {
        endGame();
    }
}

utils.listen('click', button, () => { 
    if (startButton.textContent === "Start") {
        startGame();
        startButton.textContent = "Restart";
        gameStarted = true;
    } else if (startButton.textContent === "Restart") {
        resetGame();
    }
  });


utils.listen('input', userInput, () => {
    const typedWord = userInput.value;
    let displayWord = '';
    let correct = true;

    for (let i = 0; i < currentWord.length; i++) {
        if (typedWord[i] === currentWord[i]) {
            displayWord += '<span class="correct">' + currentWord[i] + '</span>';
        } else {
            displayWord += currentWord[i];
            correct = false;
        }
    }
   
    currentWordDisplay.innerHTML = displayWord;

    if (typedWord === currentWord && correct) {
        hits++;
        hitCounterDisplay.textContent = `${hits} Hits`;
        getNextWord();
        updateCatImage()
    }
});

//The following from AI, how to prevent form submission if user hits enter
utils.listen('keydown', userInput, (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

//used W3 schools to get a switch to work 
function updateCatImage() {
    if (gameStarted === false) {
      catImage.src = './assets/media/cat1.png';
      return;
    }
    switch (true) {
        case hits < 5:
            catImage.src = './assets/media/cat1.png';
            break;
        case hits < 15:
            catImage.src = './assets/media/cat2.png';
            break;
        case hits < 25:
            catImage.src = './assets/media/cat3.png';
            break;
        case hits < 35:
            catImage.src = './assets/media/cat4.png';
            break;
        case hits < 45:
            catImage.src = './assets/media/cat5.png';
            break;
        default:
            catImage.src = './assets/media/cat6.png';
    }
}