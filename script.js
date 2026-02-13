const symbols = ["🍎", "🍌", "🍇", "🍒", "🍉", "🥝", "🍍", "🍑"];

const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const totalPairsEl = document.getElementById("totalPairs");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

totalPairsEl.textContent = String(symbols.length);

let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createCard(symbol, index) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.symbol = symbol;
  card.dataset.index = String(index);
  card.setAttribute("aria-label", "카드");

  card.innerHTML = `
    <span class="card-inner">
      <span class="face front">❓</span>
      <span class="face back">${symbol}</span>
    </span>
  `;

  card.addEventListener("click", onCardClick);
  return card;
}

function updateHud() {
  movesEl.textContent = String(moves);
  pairsEl.textContent = String(matchedPairs);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function onCardClick(event) {
  const clicked = event.currentTarget;

  if (lockBoard || clicked === firstCard || clicked.classList.contains("matched")) {
    return;
  }

  clicked.classList.add("flipped");

  if (!firstCard) {
    firstCard = clicked;
    return;
  }

  secondCard = clicked;
  lockBoard = true;
  moves += 1;
  updateHud();

  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs += 1;
    updateHud();
    resetTurn();

    if (matchedPairs === symbols.length) {
      messageEl.textContent = `축하합니다! 총 ${moves}번 만에 클리어했어요 🎉`;
    }

    return;
  }

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 700);
}

function initGame() {
  deck = shuffle([...symbols, ...symbols]);
  boardEl.innerHTML = "";
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  messageEl.textContent = "같은 그림의 카드를 찾아보세요!";
  updateHud();

  deck.forEach((symbol, index) => {
    boardEl.appendChild(createCard(symbol, index));
  });
}

restartBtn.addEventListener("click", initGame);

initGame();
