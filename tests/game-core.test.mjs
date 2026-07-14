import assert from "node:assert/strict";
import test from "node:test";

import {
  createGame,
  directionFromKey,
  directionFromSwipe,
  pauseGame,
  placeFood,
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

test("game starts with a deterministic snake and valid food", () => {
  const game = createGame({ columns: 12, rows: 12, random: () => 0 });

  assert.equal(game.snake.length, 3);
  assert.equal(game.status, "idle");
  assert.equal(game.score, 0);
  assert.ok(game.food);
  assert.equal(game.snake.some((cell) => cell.x === game.food.x && cell.y === game.food.y), false);
});

test("snake refuses reverse direction and advances one cell per step", () => {
  const initial = startGame(createGame({ columns: 12, rows: 12, random: () => 0 }));
  const reversed = queueDirection(initial, "left");
  assert.equal(reversed.queuedDirection, "right");

  const next = stepGame(initial, () => 0);
  assert.deepEqual(next.snake[0], { x: initial.snake[0].x + 1, y: initial.snake[0].y });
  assert.equal(next.snake.length, initial.snake.length);
});

test("eating food grows the snake and raises score", () => {
  const initial = startGame(createGame({ columns: 12, rows: 12, random: () => 0 }));
  const head = initial.snake[0];
  const game = { ...initial, food: { x: head.x + 1, y: head.y } };
  const next = stepGame(game, () => 0.5);

  assert.equal(next.snake.length, game.snake.length + 1);
  assert.equal(next.score, 1);
  assert.equal(next.bestScore, 1);
});

test("wall and body collisions end the game", () => {
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
});

test("pause and restart keep the game loop controlled", () => {
  const running = startGame(createGame({ columns: 10, rows: 10, random: () => 0 }));
  assert.equal(pauseGame(running).status, "paused");

  const restarted = restartGame({ ...running, score: 4, bestScore: 7 }, () => 0);
  assert.equal(restarted.score, 0);
  assert.equal(restarted.bestScore, 7);
  assert.equal(restarted.status, "idle");
});

test("food placement never lands on occupied cells", () => {
  const food = placeFood(3, 3, [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ], () => 0);

  assert.deepEqual(food, { x: 2, y: 2 });
});
