const VECTORS = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  right: "left",
  down: "up",
  left: "right",
};

export function directionFromKey(key) {
  const normalized = typeof key === "string" ? key.toLowerCase() : "";
  const map = {
    arrowup: "up",
    arrowright: "right",
    arrowdown: "down",
    arrowleft: "left",
    w: "up",
    d: "right",
    s: "down",
    a: "left",
  };
  return map[normalized] ?? null;
}

export function directionFromSwipe(start, end, threshold = 18) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return null;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function occupiedCells(snake) {
  return new Set(snake.map((cell) => `${cell.x}:${cell.y}`));
}

export function placeFood(columns, rows, snake, random = Math.random) {
  const occupied = occupiedCells(snake);
  const openCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!occupied.has(`${x}:${y}`)) openCells.push({ x, y });
    }
  }

  if (openCells.length === 0) return null;
  return openCells[Math.floor(random() * openCells.length) % openCells.length];
}

export function createGame({ columns = 20, rows = 20, random = Math.random } = {}) {
  const centerX = Math.floor(columns / 2);
  const centerY = Math.floor(rows / 2);
  const snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];

  return {
    columns,
    rows,
    snake,
    direction: "right",
    queuedDirection: "right",
    food: placeFood(columns, rows, snake, random),
    score: 0,
    bestScore: 0,
    status: "idle",
  };
}

export function startGame(game) {
  if (game.status === "running") return game;
  return { ...game, status: "running" };
}

export function pauseGame(game) {
  if (game.status !== "running") return game;
  return { ...game, status: "paused" };
}

export function restartGame(game, random = Math.random) {
  return {
    ...createGame({
      columns: game.columns,
      rows: game.rows,
      random,
    }),
    bestScore: game.bestScore,
  };
}

export function queueDirection(game, direction) {
  if (!(direction in VECTORS)) return game;

  const nextDirection = game.queuedDirection ?? game.direction;
  if (direction === nextDirection) return game;
  if (direction === OPPOSITES[game.direction]) return game;

  return { ...game, queuedDirection: direction };
}

export function stepGame(game, random = Math.random) {
  if (game.status !== "running") return game;

  const direction = game.queuedDirection ?? game.direction;
  const vector = VECTORS[direction];
  const head = game.snake[0];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };
  const wallHit =
    nextHead.x < 0 ||
    nextHead.x >= game.columns ||
    nextHead.y < 0 ||
    nextHead.y >= game.rows;

  if (wallHit) {
    return {
      ...game,
      direction,
      queuedDirection: direction,
      status: "over",
      bestScore: Math.max(game.bestScore, game.score),
    };
  }

  const ateFood = game.food && sameCell(nextHead, game.food);
  const bodyToCheck = ateFood ? game.snake : game.snake.slice(0, -1);

  if (bodyToCheck.some((cell) => sameCell(cell, nextHead))) {
    return {
      ...game,
      direction,
      queuedDirection: direction,
      status: "over",
      bestScore: Math.max(game.bestScore, game.score),
    };
  }

  const snake = [nextHead, ...game.snake];
  if (!ateFood) snake.pop();

  const score = game.score + (ateFood ? 1 : 0);
  const food = ateFood ? placeFood(game.columns, game.rows, snake, random) : game.food;

  return {
    ...game,
    snake,
    direction,
    queuedDirection: direction,
    food,
    score,
    bestScore: Math.max(game.bestScore, score),
  };
}

function roundSize(value) {
  return Math.max(280, Math.floor(value));
}

function drawBoard(context, state) {
  const size = context.canvas.width;
  const cell = size / state.columns;

  context.clearRect(0, 0, size, size);
  context.fillStyle = "#0f141c";
  context.fillRect(0, 0, size, size);

  context.strokeStyle = "rgba(255,255,255,0.045)";
  context.lineWidth = 1;

  for (let index = 1; index < state.columns; index += 1) {
    const offset = index * cell;
    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(offset, size);
    context.stroke();
    context.beginPath();
    context.moveTo(0, offset);
    context.lineTo(size, offset);
    context.stroke();
  }

  if (state.food) {
    context.fillStyle = "#ff7d7d";
    context.beginPath();
    context.arc((state.food.x + 0.5) * cell, (state.food.y + 0.5) * cell, cell * 0.3, 0, Math.PI * 2);
    context.fill();
  }

  state.snake.forEach((segment, index) => {
    const pad = Math.max(1.5, cell * 0.12);
    context.fillStyle = index === 0 ? "#efffc8" : "#8fd3ff";
    context.beginPath();
    context.roundRect(segment.x * cell + pad, segment.y * cell + pad, cell - pad * 2, cell - pad * 2, cell * 0.22);
    context.fill();
  });
}

export function initSnakeGame(root = document) {
  if (typeof document === "undefined") return null;
  if (window.__dongjaeSnakeMounted) return window.__dongjaeSnakeMounted;

  const board = root.querySelector("#snake-board");
  const scoreEl = root.querySelector("#game-score");
  const bestEl = root.querySelector("#game-best");
  const statusEl = root.querySelector("#game-status");
  const startButton = root.querySelector("#game-start");
  const restartButton = root.querySelector("#game-restart");
  const directionButtons = root.querySelectorAll("[data-direction]");

  if (!board || !scoreEl || !bestEl || !statusEl || !startButton || !restartButton) {
    return null;
  }

  const context = board.getContext("2d");
  let state = createGame();
  let timerId = null;
  let swipeStart = null;

  const updateHud = () => {
    scoreEl.textContent = String(state.score).padStart(2, "0");
    bestEl.textContent = String(state.bestScore).padStart(2, "0");
    if (state.status === "idle") {
      startButton.textContent = "Start";
    } else if (state.status === "running") {
      startButton.textContent = "Pause";
    } else if (state.status === "paused") {
      startButton.textContent = "Resume";
    } else {
      startButton.textContent = "Play again";
    }
  };

  const setStatus = (message) => {
    statusEl.textContent = message;
  };

  const render = () => {
    const size = roundSize(board.getBoundingClientRect().width || 640);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    board.width = size * ratio;
    board.height = size * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawBoard(context, state);
    updateHud();
  };

  const stopTimer = () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const startTimer = () => {
    if (timerId !== null) return;
    timerId = window.setInterval(tick, 120);
  };

  const beginRunning = (message) => {
    if (state.status === "over" || state.status === "idle") {
      state = restartGame(state);
    }
    state = startGame(state);
    startTimer();
    setStatus(message);
    render();
    board.focus();
  };

  function tick() {
    state = stepGame(state);
    if (state.status === "over") {
      stopTimer();
      setStatus(`Game over. Score ${state.score}. Press Play again or Restart.`);
    }
    render();
  }

  const toggleStart = () => {
    if (state.status === "running") {
      state = pauseGame(state);
      stopTimer();
      setStatus("Game paused.");
      render();
      return;
    }

    if (state.status === "paused") {
      state = startGame(state);
      startTimer();
      setStatus("Game resumed.");
      render();
      return;
    }

    beginRunning("Game running. Use arrow keys, WASD, swipe, or the direction buttons.");
  };

  const restart = () => {
    state = restartGame(state);
    state = startGame(state);
    stopTimer();
    startTimer();
    setStatus("Game restarted.");
    render();
    board.focus();
  };

  const applyDirection = (direction) => {
    if (!direction) return;
    state = queueDirection(state, direction);
    if (state.status === "idle") {
      beginRunning("Game running. Use arrow keys, WASD, swipe, or the direction buttons.");
    }
    render();
  };

  const onKeyDown = (event) => {
    const direction = directionFromKey(event.key);
    if (direction) {
      event.preventDefault();
      applyDirection(direction);
      return;
    }

    if (event.key === " " || event.key === "Spacebar") {
      if (board.contains(document.activeElement) || document.activeElement === startButton || document.activeElement === restartButton) {
        event.preventDefault();
        toggleStart();
      }
    }
  };

  const onPointerDown = (event) => {
    swipeStart = { x: event.clientX, y: event.clientY };
    board.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event) => {
    if (!swipeStart) return;
    const direction = directionFromSwipe(swipeStart, { x: event.clientX, y: event.clientY });
    swipeStart = null;
    applyDirection(direction);
  };

  const onPointerCancel = () => {
    swipeStart = null;
  };

  startButton.addEventListener("click", toggleStart);
  restartButton.addEventListener("click", restart);

  directionButtons.forEach((button) => {
    button.addEventListener("click", () => applyDirection(button.dataset.direction));
  });

  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", render);
  board.addEventListener("pointerdown", onPointerDown);
  board.addEventListener("pointerup", onPointerUp);
  board.addEventListener("pointercancel", onPointerCancel);

  render();
  setStatus("Ready. Press Start or move once to begin.");

  window.__dongjaeSnakeMounted = {
    destroy() {
      stopTimer();
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", render);
      board.removeEventListener("pointerdown", onPointerDown);
      board.removeEventListener("pointerup", onPointerUp);
      board.removeEventListener("pointercancel", onPointerCancel);
      startButton.removeEventListener("click", toggleStart);
      restartButton.removeEventListener("click", restart);
      directionButtons.forEach((button) => {
        button.replaceWith(button.cloneNode(true));
      });
      window.__dongjaeSnakeMounted = null;
    },
  };

  return window.__dongjaeSnakeMounted;
}
