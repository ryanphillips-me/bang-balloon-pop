// #region GAME LOGIC AND DATA

//DATA
let clickCount = 0;
let balloonHeight = 100;
let balloonWidth = 80;
let balloonInflation = 20;
let maxSize = 300;
let currentPopCount = 0;
let highestPopCount = 0;
let gameLength = 60000;
let clockId = 0;
let timeRemaining = 0;
let currentPlayer = {};
let currentColor = "red"
let possibleColors = ["purple", "green", "red", "blue"]

function startGame() {
  document.getElementById("game-controls").classList.remove("hidden");
  document.getElementById("main-controls").classList.add("hidden");
  document.getElementById("scoreboard").classList.add("hidden");

  startClock();
  setTimeout(stopGame, gameLength);
}

function startClock() {
  timeRemaining = gameLength;
  drawClock();
  clockId = setInterval(drawClock, 1000);
}

function stopClock() {
  clearInterval(clockId);
}

function drawClock() {
  let countdownElement = document.getElementById("countdown");
  countdownElement.innerText = (timeRemaining / 1000).toString();
  timeRemaining -= 1000;
}

function inflate() {
  clickCount++;
  balloonHeight += balloonInflation;
  balloonWidth += balloonInflation;
  checkBalloonPop()
  draw();
}

function checkBalloonPop() {
  if (balloonHeight > maxSize) {
    console.log("Balloon Popped...");
    let balloonElement = document.getElementById("balloon");
    balloonElement.classList.remove(currentColor);
    getRandomColor()
    balloonElement.classList.add(currentColor);

    // @ts-ignore
    document.getElementById("pop-sound").play()

    currentPopCount++;
    balloonHeight = 0;
    balloonWidth = 0;
  }
}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length);
  currentColor = possibleColors[i]
}

function draw() {
  let balloonElement = document.getElementById("balloon");
  let clickCountElement = document.getElementById("click-count");
  let popCountElement = document.getElementById("pop-count");
  let highPopCountElement = document.getElementById("high-pop-count");
  let playerNameElement = document.getElementById("player-name");

  balloonElement.style.height = balloonHeight + "px";
  balloonElement.style.width = balloonWidth + "px";

  clickCountElement.innerText = clickCount.toString();
  popCountElement.innerText = currentPopCount.toString();
  highPopCountElement.innerText = currentPlayer.topScore.toString();
  playerNameElement.innerText = currentPlayer.name;
}

function stopGame() {
  document.getElementById("game-controls").classList.add("hidden");
  document.getElementById("main-controls").classList.remove("hidden");
  document.getElementById("scoreboard").classList.remove("hidden");

  clickCount = 0;
  balloonHeight = 100;
  balloonWidth = 80;

  topPop();
  stopClock();
  draw();
  drawScoreboard();
}

function topPop() {
  if (currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount;
    savePlayers();
  }
  currentPopCount = 0;
}

// #endregion

let players = [];
loadPlayers();

function setPlayer(event) {
  event.preventDefault();
  let form = event.target;

  let playerName = form.playerName.value;
  currentPlayer = players.find((player) => player.name == playerName);

  if (!currentPlayer) {
    currentPlayer = { name: playerName, topScore: 0 };
    players.push(currentPlayer);
    savePlayers();
  }

  form.reset();
  document.getElementById("game").classList.remove("hidden");
  form.classList.add("hidden");
  draw();
  drawScoreboard();
}

function changePlayer() {
  document.getElementById("player-form").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
}

function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players));
}

function loadPlayers() {
  let playersData = JSON.parse(window.localStorage.getItem("players"));

  if (playersData) {
    players = playersData;
  }
}

function drawScoreboard() {
  let template = ""

  players.sort((p1, p2) => p2.topScore - p1.topScore)

  players.forEach( player => {
    template += `
    <div class="d-flex space-between">
      <span>
        <i class="fa fa-user-circle" aria-hidden="true"></i>
        ${player.name}
      </span>
      <span>Top Popped: ${player.topScore}</span>
    </div>`
  })

  document.getElementById("players").innerHTML = template
}

drawScoreboard();
