'use strict';
import * as utils from "./utils.js";
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
let wordsPlayedThisGame = 0; 
let scoreHistory = loadScoreHistory(); 

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
  
    resetGameDisplay(); 
  
    getNextWord(); 
    userInput.focus();
}

function resetGame() {
    clearInterval(countdownInterval);
    countdownDisplay.textContent = '- - -';
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    wordsPlayedThisGame = 0; 
    startGame();
}

function endGame() {
    gameStarted = false;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    startButton.textContent = "Restart";
    const finalScore = new Score(hits);
    console.log("Final Score (Class):", finalScore);
    saveScore(hits, wordsPlayedThisGame);
    wordsPlayedThisGame = 0;
    displayScoreboard(); 
}

function getNextWord() {
    if (wordList.length > 0) {
        currentWord = wordList[wordList.length - 1];
        currentWordDisplay.textContent = currentWord;
        wordList.pop();
        userInput.value = '';
        wordsPlayedThisGame++;
    } else {
        endGame();
    }
}

function resetGameDisplay() {
    userInput.value = '';
    userInput.placeholder = "Enter word here";
    hits = 0;
    hitCounterDisplay.textContent = `${hits} Hits`;
    currentWordDisplay.textContent = ''; 
    startButton.textContent = "Restart";
    updateCatImage(); 
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

function updateCatImage() {
  if (gameStarted === false) {
    catImage.src = './assets/media/cat1.png';
    return;
  }

  if (hits < 5) {
    catImage.src = './assets/media/cat1.png';
  } else if (hits < 15) {
    catImage.src = './assets/media/cat2.png';
  } else if (hits < 25) {
    catImage.src = './assets/media/cat3.png';
  } else if (hits < 35) {
    catImage.src = './assets/media/cat4.png';
  } else if (hits < 45) {
    catImage.src = './assets/media/cat5.png';
  } else {
    catImage.src = './assets/media/cat6.png';
  }
}

function getDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
}

function createScoreObject(hits, totalWords) {
    const date = Date.now();
    const percentage = totalWords > 0 ? (hits / totalWords) * 100 : 0;
    return {
        date: getDate(date), 
        hits: hits,
        percentage: percentage.toFixed(2)
    };
}

function loadScoreHistory() {
    const storedScores = localStorage.getItem("scoreHistory");
    return storedScores ? JSON.parse(storedScores) : [];
}

function saveScore(hits, totalWords) {
    const scoreObject = createScoreObject(hits, totalWords);
    scoreHistory.push(scoreObject);

    scoreHistory.sort((a, b) => b.hits - a.hits);
    const topScoresToSave = scoreHistory.slice(0, 10); 
    localStorage.setItem("scoreHistory", JSON.stringify(topScoresToSave));
    scoreHistory = topScoresToSave;
}

function displayScoreboard() {
    const highScoresList = utils.select('.high-scores-list');
    if (!highScoresList) {
        console.error("Could not find the .high-scores-list element in the HTML.");
        return;
    }

    const sortedScores = scoreHistory.sort((a, b) => b.hits - a.hits); 
    highScoresList.innerHTML = '';
    const topScores = sortedScores.slice(0, 9); 

    if (topScores.length === 0) {
        const noScoresMessage = utils.create('p');
        noScoresMessage.textContent = "No scores recorded yet!";
        highScoresList.appendChild(noScoresMessage);
    } else {
        topScores.forEach((score, index) => {
            const scoreEntry = utils.create('p');
            scoreEntry.classList.add('high-score-entry'); 
            scoreEntry.textContent = `${index + 1}. ${score.hits} Hits (${score.percentage}%) - ${score.date}`;
            highScoresList.appendChild(scoreEntry);
        });
    }
}
