'use strict';

const mainContainer = document.querySelector('.container');
const boxContainer = document.querySelector('.box');
const movesNum = document.querySelector('.moves--num');
const scoreNum = document.querySelector('.score--num');
const homeScreen = document.querySelector('.log--board');
const inputNickname = document.querySelector('.nickname__input');
const inputNum = document.querySelector('.field__input');
const form = document.querySelector('form');
const usernameLabel = document.querySelector('.nickname');
const formP = document.querySelector('.formP');
const highscoreList = document.querySelector('.highscore__list');
const buttonReset = document.querySelector('.restart--play');
const resetField = document.querySelector('.restart');
const mindArr = [];
let scoreArr = [];
let nicknameArr = [];
const indexArr = [];
const divArr = [
  '<div class="layer" data-planet="Moon"><img class="front" src="planet1.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Venus"><img class="front" src="planet2.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Mars"><img class="front" src="planet3.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Earth"><img class="front" src="planet4.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Jupiter"><img class="front" src="planet5.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Saturn"><img class="front" src="planet8.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Uranus"><img class="front" src="planet6.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Neptune"><img class="front" src="planet7.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Moon"><img class="front" src="planet1.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Venus"><img class="front" src="planet2.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Mars"><img class="front" src="planet3.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Earth"><img class="front" src="planet4.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Jupiter"><img class="front" src="planet5.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Saturn"><img class="front" src="planet8.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Uranus"><img class="front" src="planet6.jpg"><img class="back" src="back.png"></div>',
  '<div class="layer" data-planet="Neptune"><img class="front" src="planet7.jpg"><img class="back" src="back.png"></div>',
];

function randomIndex() {
  while (indexArr.length < 16) {
    const random = Math.floor(Math.random() * 16);
    if (indexArr.every(ele => ele !== random)) {
      indexArr.push(random);
    }
    if (indexArr.length === 16) break;
  }
}
//Function for Inserting html
function insertHtml() {
  for (let i = 0; i < indexArr.length; i++) {
    boxContainer.insertAdjacentHTML('beforeend', divArr[indexArr[i]]);
  }
}

function blinkingHint() {
  setInterval(() => {
    formP.classList.toggle('hide');
  }, 1100);
}
//FUNCTION CALLS
// function for login ENTER blink
blinkingHint();
randomIndex();
insertHtml();
getStorage();
///LOGIC///--**--**--**--**--**//////logic--*-
const cards = document.querySelectorAll('.layer');
let flippedCardState = false;
let lockBoard = false;
let firstCard, secondCard;

let score = 0;
let moves = 12;
let gameState = true;

function cardFlip() {
  if (gameState === false) return;
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add('flip');
  if (!flippedCardState) {
    flippedCardState = true;
    firstCard = this;
    return;
  }
  secondCard = this;

  cardMatch();
}

function cardMatch() {
  if (firstCard.dataset.planet === secondCard.dataset.planet) {
    score++;

    scoreNum.textContent = score;
    checkScore(score);
    disableCards();
    return;
  }
  moves--;

  movesNum.textContent = `${moves} left`;
  checkMoves(moves);
  unFlipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', cardFlip);
  secondCard.removeEventListener('click', cardFlip);
  resetBoard();
}

function unFlipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [flippedCardState, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
//CHECK MOVES LEFT
function checkMoves(move) {
  if (move <= 0) {
    gameState = false;
    scoreArr.push(score);
    setStorage();
    setTimeout(() => {
      movesNum.textContent = `${move} left. YOU LOSE!`;
      resetField.classList.remove('hidden');
    }, 2000);
  }
}
//CHECK SCORE
function checkScore(score) {
  if (score === 8) {
    gameState = false;
    scoreArr.push(score);
    setStorage();
    setTimeout(() => {
      scoreNum.textContent = `YOU WON!`;
      resetField.classList.remove('hidden');
    }, 2000);
  }
}
//FUNCTION FOR HIGHSCORE INSERTING
function insertHighScores(name, score) {
  const html = `<li>${name.toUpperCase()} - ${score} ${
    score > 1 ? 'points' : 'point'
  }</li>`;
  highscoreList.insertAdjacentHTML('afterbegin', html);
}
///FUNCTION RESET///
function reset() {
  getStorage();
  resetField.classList.add('hidden');
  homeScreen.classList.remove('hidden');
  mainContainer.classList.add('hidden');
  mainContainer.classList.add('none');
  score = 0;
  moves = 12;
  resetBoard();
  gameState = true;
}
///set storage
function setStorage() {
  localStorage.setItem('score', JSON.stringify(scoreArr));
  localStorage.setItem('nickname', JSON.stringify(nicknameArr));
}
///get storage
function getStorage() {
  const dataScore = JSON.parse(localStorage.getItem('score', scoreArr));
  const dataName = JSON.parse(localStorage.getItem('nickname', nicknameArr));
  //Scores to dataScore
  if (!dataScore) return;
  scoreArr = dataScore;
  //Nicknames to dataNames
  if (!dataName) return;
  nicknameArr = dataName;
  const obj = {};
  for (let i = 0; i < scoreArr?.length; i++) {
    obj[nicknameArr[i]] = scoreArr[i];
  }
  //SORT
  Object.entries(obj)
    .sort(([, a], [, b]) => a - b)
    .forEach(([name, score]) => {
      //INSERT IN HIGHSCORES
      insertHighScores(name, score);
    });
}
/////

/////
//EVENT LISTENERS
cards.forEach(card => card.addEventListener('click', cardFlip));

function userName(name) {
  const nickname = name.toLowerCase();
  return nickname.replace(nickname[0], nickname[0].toUpperCase());
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const nickname = userName(inputNickname.value);
  nicknameArr.push(nickname);

  homeScreen.classList.add('hidden');
  usernameLabel.textContent = nickname;
  setTimeout(() => homeScreen.classList.add('none'), 400);
  setTimeout(() => {
    mainContainer.classList.remove('none');
  }, 420);
  setTimeout(() => {
    mainContainer.classList.remove('hidden');
  }, 440);
  inputNickname.blur();
  inputNickname.value = '';
  moves = 12;
  movesNum.textContent = moves;
  gameState = true;
});

//restart
buttonReset.addEventListener('click', reset);
document.querySelector('.btn--clear').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.clear();
  location.reload();
  getStorage();
});
