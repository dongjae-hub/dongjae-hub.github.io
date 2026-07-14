import assert from "node:assert/strict";
import test from "node:test";

import {
  createGame,
  directionFromKey,
  directionFromSwipe,
  moveEnemy,
  pauseGame,
  placeFood,
  placeEnemy,
  queueDirection,
  restartGame,
  startGame,
  stepGame,
} from "../game.js";

test("keyboard and swipe mappings are stable", () => {
  assert.equal(directionFromKey("ArrowUp"), "up");
  assert.equal(directionFromKey("w"), "up");
  assert.equal(directionFromKey("ArrowRight"), "right");
  assert.equal(directionFromKey("d"), "right");
  assert.equal(directionFromKey("Escape"), null);
  assert.equal(directionFromSwipe({ x: 0, y: 0 }, { x: 40, y: 10 }), "right");
  assert.equal(directionFromSwipe({ x: 0, y: 0 }, { x: 10, y: 38 }), "down");
  assert.equal(directionFromSwipe({ x: 0, y: 0 }, { x: 7, y: 7 }), null);
});

test("game starts with a deterministic snake, food, enemy, and valid placement", () => {
  const game = createGame({ columns: 12, rows: 12, random: () => 0 });

  assert.equal(game.snake.length, 3);
  assert.equal(game.status, "idle");
  assert.equal(game.score, 0);
  assert.ok(game.food);
  assert.ok(game.enemy);
  assert.equal(game.snake.some((cell) => cell.x === game.food.x && cell.y === game.food.y), false);
  assert.equal(game.snake.some((cell) => cell.x === game.enemy.x && cell.y === game.enemy.y), false);
  assert.equal(game.food.x === game.enemy.x && game.food.y === game.enemy.y, false);
});

test("snake refuses reverse direction and advances one cell per step", () => {
  const initial = startGame(createGame({ columns: 12, rows: 12, random: () => 0 }));
  const reversed = queueDirection(initial, "left");
  assert.equal(reversed.queuedDirection, "right");

  const next = stepGame(initial, () => 0);
  assert.deepEqual(next.snake[0], { x: initial.snake[0].x + 1, y: initial.snake[0].y });
  assert.equal(next.snake.length, initial.snake.length);
});

test("eating food grows the snake, raises score, and triggers pickup effects", () => {
  const initial = startGame(createGame({ columns: 12, rows: 12, random: () => 0 }));
  const head = initial.snake[0];
  const game = { ...initial, food: { x: head.x + 1, y: head.y } };
  const next = stepGame(game, () => 0.5);

  assert.equal(next.snake.length, game.snake.length + 1);
  assert.equal(next.score, 1);
  assert.equal(next.bestScore, 1);
  assert.equal(next.effects.pickupTicks > 0, true);
});

test("score five enables the flash effect", () => {
  const initial = startGame(createGame({ columns: 12, rows: 12, random: () => 0 }));
  const head = initial.snake[0];
  const game = {
    ...initial,
    score: 4,
    food: { x: head.x + 1, y: head.y },
  };
  const next = stepGame(game, () => 0.5);

  assert.equal(next.score, 5);
  assert.equal(next.effects.flashTicks > 0, true);
});

test("wall, body, and enemy collisions end the game", () => {
  const wall = startGame(createGame({ columns: 8, rows: 8, random: () => 0 }));
  const wallGame = {
    ...wall,
    snake: [{ x: 7, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 3 }],
    direction: "right",
    queuedDirection: "right",
  };
  assert.equal(stepGame(wallGame, () => 0).status, "over");

  const body = startGame(createGame({ columns: 8, rows: 8, random: () => 0 }));
  const bodyGame = {
    ...body,
    snake: [
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 4 },
    ],
    direction: "down",
    queuedDirection: "down",
  };
  assert.equal(stepGame(bodyGame, () => 0).status, "over");

  const enemy = startGame(createGame({ columns: 8, rows: 8, random: () => 0 }));
  const enemyGame = {
    ...enemy,
    snake: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }],
    enemy: { x: 4, y: 3 },
    food: { x: 0, y: 0 },
    direction: "right",
    queuedDirection: "right",
  };
  assert.equal(stepGame(enemyGame, () => 0).status, "over");
});

test("pause and restart keep the game loop controlled", () => {
  const running = startGame(createGame({ columns: 10, rows: 10, random: () => 0 }));
  assert.equal(pauseGame(running).status, "paused");

  const restarted = restartGame({ ...running, score: 4, bestScore: 7 }, () => 0);
  assert.equal(restarted.score, 0);
  assert.equal(restarted.bestScore, 7);
  assert.equal(restarted.status, "idle");
  assert.equal(restarted.enemy !== null, true);
});

test("food and enemy placement never land on occupied cells", () => {
  const occupiedSnake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ];

  const food = placeFood(
    3,
    3,
    occupiedSnake,
    { x: 0, y: 2 },
    () => 0,
  );
  assert.deepEqual(food, { x: 2, y: 2 });

  const enemy = placeEnemy(
    3,
    3,
    occupiedSnake,
    { x: 0, y: 2 },
    () => 0,
  );
  assert.deepEqual(enemy, { x: 2, y: 2 });
});

test("enemy movement avoids snake and food cells when possible", () => {
  const game = {
    ...startGame(createGame({ columns: 6, rows: 6, random: () => 0 })),
    enemy: { x: 3, y: 3 },
    snake: [
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 1, y: 4 },
    ],
    food: { x: 3, y: 2 },
  };

  const next = moveEnemy(game, () => 0);
  assert.equal(next.x === 2 && next.y === 3, false);
  assert.equal(next.x === 3 && next.y === 2, false);
});
