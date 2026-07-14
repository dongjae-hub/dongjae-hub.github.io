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

const EMPTY_EFFECTS = () => ({ flashTicks: 0, pickupTicks: 0, shakeTicks: 0 });

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

function occupiedCells(snake, food, enemy) {
  const occupied = new Set(snake.map((cell) => `${cell.x}:${cell.y}`));

  if (food) occupied.add(`${food.x}:${food.y}`);
  if (enemy) occupied.add(`${enemy.x}:${enemy.y}`);

  return occupied;
}

function randomChoice(items, random) {
  if (items.length === 0) return null;
  const index = Math.floor(random() * items.length) % items.length;
  return items[index];
}

export function placeFood(columns, rows, snake, enemy, random = Math.random) {
  const occupied = occupiedCells(snake, null, enemy);
  const openCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!occupied.has(`${x}:${y}`)) openCells.push({ x, y });
    }
  }

  return randomChoice(openCells, random);
}

export function placeEnemy(columns, rows, snake, food, random = Math.random) {
  const occupied = occupiedCells(snake, food, null);
  const openCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!occupied.has(`${x}:${y}`)) openCells.push({ x, y });
    }
  }

  return randomChoice(openCells, random);
}

function createEffects() {
  return { ...EMPTY_EFFECTS() };
}

function cloneEffects(effects) {
  return {
    flashTicks: effects?.flashTicks ?? 0,
    pickupTicks: effects?.pickupTicks ?? 0,
    shakeTicks: effects?.shakeTicks ?? 0,
  };
}

function decrementEffects(effects) {
  return {
    flashTicks: Math.max(0, (effects?.flashTicks ?? 0) - 1),
    pickupTicks: Math.max(0, (effects?.pickupTicks ?? 0) - 1),
    shakeTicks: Math.max(0, (effects?.shakeTicks ?? 0) - 1),
  };
}

function isInside(columns, rows, cell) {
  return cell.x >= 0 && cell.x < columns && cell.y >= 0 && cell.y < rows;
}

export function createGame({ columns = 20, rows = 20, random = Math.random } = {}) {
  const centerX = Math.floor(columns / 2);
  const centerY = Math.floor(rows / 2);
  const snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];
  const enemy = placeEnemy(columns, rows, snake, null, random);
  const food = placeFood(columns, rows, snake, enemy, random);

  return {
    columns,
    rows,
    snake,
    direction: "right",
    queuedDirection: "right",
    food,
    enemy,
    score: 0,
    bestScore: 0,
    status: "idle",
    effects: createEffects(),
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

  const currentDirection = game.queuedDirection ?? game.direction;
  if (direction === currentDirection) return game;
  if (direction === OPPOSITES[currentDirection]) return game;

  return { ...game, queuedDirection: direction };
}

export function moveEnemy(game, random = Math.random) {
  if (!game.enemy) return null;

  const choices = Object.entries(VECTORS)
    .map(([direction, vector]) => ({
      direction,
      cell: {
        x: game.enemy.x + vector.x,
        y: game.enemy.y + vector.y,
      },
    }))
    .filter(({ cell }) => isInside(game.columns, game.rows, cell))
    .filter(({ cell }) => !game.snake.some((segment) => sameCell(segment, cell)))
    .filter(({ cell }) => !game.food || !sameCell(game.food, cell));

  const next = randomChoice(choices, random);
  return next?.cell ?? game.enemy;
}

function finishGame(game, effects) {
  return {
    ...game,
    status: "over",
    bestScore: Math.max(game.bestScore, game.score),
    effects: {
      ...effects,
      shakeTicks: 1,
    },
  };
}

function awardPickupEffects(score, effects) {
  return {
    ...effects,
    pickupTicks: 5,
    flashTicks: score > 0 && score % 5 === 0 ? 6 : effects.flashTicks,
  };
}

export function stepGame(game, random = Math.random) {
  if (game.status !== "running") return game;

  const direction = game.queuedDirection ?? game.direction;
  const vector = VECTORS[direction];
  const head = game.snake[0];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };
  const effects = decrementEffects(cloneEffects(game.effects));

  const wallHit =
    nextHead.x < 0 ||
    nextHead.x >= game.columns ||
    nextHead.y < 0 ||
    nextHead.y >= game.rows;

  const bodyToCheck = game.food && sameCell(nextHead, game.food) ? game.snake : game.snake.slice(0, -1);
  const bodyHit = bodyToCheck.some((cell) => sameCell(cell, nextHead));
  const enemyHit = game.enemy ? sameCell(nextHead, game.enemy) : false;

  if (wallHit || bodyHit || enemyHit) {
    return finishGame(
      {
        ...game,
        direction,
        queuedDirection: direction,
      },
      effects,
    );
  }

  const ateFood = game.food && sameCell(nextHead, game.food);
  const snake = [nextHead, ...game.snake];

  if (!ateFood) {
    snake.pop();
  }

  const score = game.score + (ateFood ? 1 : 0);
  const food = ateFood ? placeFood(game.columns, game.rows, snake, game.enemy, random) : game.food;
  const enemyState = moveEnemy(
    {
      ...game,
      snake,
      food,
      enemy: game.enemy,
    },
    random,
  );

  return {
    ...game,
    snake,
    direction,
    queuedDirection: direction,
    food,
    enemy: enemyState,
    score,
    bestScore: Math.max(game.bestScore, score),
    effects: ateFood ? awardPickupEffects(score, effects) : effects,
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

  if (state.enemy) {
    const pad = Math.max(1.5, cell * 0.16);
    context.fillStyle = "#ffcf6f";
    context.beginPath();
    if (typeof context.roundRect === "function") {
      context.roundRect(state.enemy.x * cell + pad, state.enemy.y * cell + pad, cell - pad * 2, cell - pad * 2, cell * 0.22);
    } else {
      const x = state.enemy.x * cell + pad;
      const y = state.enemy.y * cell + pad;
      const width = cell - pad * 2;
      const height = cell - pad * 2;
      const radius = Math.min(cell * 0.22, width / 2, height / 2);
      context.moveTo(x + radius, y);
      context.lineTo(x + width - radius, y);
      context.quadraticCurveTo(x + width, y, x + width, y + radius);
      context.lineTo(x + width, y + height - radius);
      context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      context.lineTo(x + radius, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - radius);
      context.lineTo(x, y + radius);
      context.quadraticCurveTo(x, y, x + radius, y);
    }
    context.fill();
  }

  state.snake.forEach((segment, index) => {
    const pad = Math.max(1.5, cell * 0.12);
    context.fillStyle = index === 0 ? "#efffc8" : "#8fd3ff";
    context.beginPath();
    if (typeof context.roundRect === "function") {
      context.roundRect(segment.x * cell + pad, segment.y * cell + pad, cell - pad * 2, cell - pad * 2, cell * 0.22);
    } else {
      const x = segment.x * cell + pad;
      const y = segment.y * cell + pad;
      const width = cell - pad * 2;
      const height = cell - pad * 2;
      const radius = Math.min(cell * 0.22, width / 2, height / 2);
      context.moveTo(x + radius, y);
      context.lineTo(x + width - radius, y);
      context.quadraticCurveTo(x + width, y, x + width, y + radius);
      context.lineTo(x + width, y + height - radius);
      context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      context.lineTo(x + radius, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - radius);
      context.lineTo(x, y + radius);
      context.quadraticCurveTo(x, y, x + radius, y);
    }
    context.fill();
  });
}

export function initSnakeGame(root = document) {
  if (typeof document === "undefined") return null;
  if (window.__dongjaeSnakeMounted) return window.__dongjaeSnakeMounted;

  const board = root.querySelector("#snake-board");
  const stage = root.querySelector(".game-stage");
  const scoreEl = root.querySelector("#game-score");
  const bestEl = root.querySelector("#game-best");
  const statusEl = root.querySelector("#game-status");
  const startButton = root.querySelector("#game-start");
  const pauseButton = root.querySelector("#game-pause");
  const restartButton = root.querySelector("#game-restart");
  const directionButtons = root.querySelectorAll("[data-direction]");

  if (!board || !stage || !scoreEl || !bestEl || !statusEl || !startButton || !pauseButton || !restartButton) {
    return null;
  }

  const context = board.getContext("2d");
  let state = createGame();
  let timerId = null;
  let swipeStart = null;

  const updateHud = () => {
    scoreEl.textContent = String(state.score).padStart(2, "0");
    bestEl.textContent = String(state.bestScore).padStart(2, "0");
    startButton.textContent = state.status === "paused" ? "Resume" : state.status === "over" ? "Play again" : "Start";
    pauseButton.textContent = state.status === "paused" ? "Resume" : "Pause";
    pauseButton.disabled = state.status !== "running" && state.status !== "paused";
    restartButton.textContent = "Restart";
  };

  const setStatus = (message) => {
    statusEl.textContent = message;
  };

  const syncEffects = () => {
    stage.dataset.flash = String((state.effects?.flashTicks ?? 0) > 0);
    stage.dataset.pickup = String((state.effects?.pickupTicks ?? 0) > 0);
    stage.dataset.shake = String(state.status === "over" || (state.effects?.shakeTicks ?? 0) > 0);
  };

  const render = () => {
    const size = roundSize(board.getBoundingClientRect().width || 640);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    board.width = size * ratio;
    board.height = size * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawBoard(context, state);
    syncEffects();
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
    timerId = window.setInterval(tick, 100);
  };

  const startOrResume = (message, openingDirection = null) => {
    if (state.status === "paused") {
      state = startGame(state);
      startTimer();
      setStatus(message ?? "Game resumed.");
      render();
      board.focus();
      return;
    }

    if (state.status === "over" || state.status === "idle") {
      state = restartGame(state);
    }

    if (openingDirection) {
      state = queueDirection(state, openingDirection);
    }

    state = startGame(state);
    startTimer();
    setStatus(message ?? "Game running. Use arrow keys, WASD, swipe, or the direction buttons.");
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

  const togglePause = () => {
    if (state.status === "running") {
      state = pauseGame(state);
      stopTimer();
      setStatus("Game paused.");
      render();
      return;
    }

    if (state.status === "paused") {
      startOrResume("Game resumed.");
    }
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
    if (state.status === "idle" || state.status === "over") {
      startOrResume(undefined, direction);
      return;
    }

    state = queueDirection(state, direction);
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
      event.preventDefault();
      if (state.status === "running" || state.status === "paused") {
        togglePause();
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

  const handleStartClick = () => startOrResume();
  const handlePauseClick = () => togglePause();
  const handleRestartClick = () => restart();

  startButton.addEventListener("click", handleStartClick);
  pauseButton.addEventListener("click", handlePauseClick);
  restartButton.addEventListener("click", handleRestartClick);

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
      startButton.removeEventListener("click", handleStartClick);
      pauseButton.removeEventListener("click", handlePauseClick);
      restartButton.removeEventListener("click", handleRestartClick);
      directionButtons.forEach((button) => {
        button.replaceWith(button.cloneNode(true));
      });
      window.__dongjaeSnakeMounted = null;
    },
  };

  return window.__dongjaeSnakeMounted;
}
