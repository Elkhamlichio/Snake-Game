import React, { useState, useEffect } from "react";
import "./App.css";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: 1 };

const App = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 200);

    return () => clearInterval(interval);
  }, [snake, direction, isGameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[newSnake.length - 1] };
    head.x += direction.x;
    head.y += direction.y;

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= GRID_SIZE ||
      head.y >= GRID_SIZE ||
      newSnake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setIsGameOver(true);
      return;
    }

    newSnake.push(head);

    if (head.x === food.x && head.y === food.y) {
      generateFood();
      setScore(score + 10);
    } else {
      newSnake.shift();
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    generateFood();
    setIsGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="score-board">
        <h1>Snake Game</h1>
        <p>Score: {score}</p>
      </div>
      {isGameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={resetGame}>Restart</button>
        </div>
      ) : (
        <div className="grid">
          {Array.from({ length: GRID_SIZE }).map((_, row) =>
            Array.from({ length: GRID_SIZE }).map((_, col) => {
              const isSnake = snake.some(segment => segment.x === col && segment.y === row);
              const isFood = food.x === col && food.y === row;
              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default App;
