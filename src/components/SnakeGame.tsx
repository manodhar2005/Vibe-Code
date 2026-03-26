import { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const highScoreRef = useRef(highScore);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { highScoreRef.current = highScore; }, [highScore]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const newFood = generateFood(INITIAL_SNAKE);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(newFood);
    setScore(0);
    setGameOver(false);
    setHasStarted(true);
    setIsPaused(false);
    
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    foodRef.current = newFood;
    scoreRef.current = 0;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused((p) => !p);
        return;
      }

      if (!hasStarted || isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) {
            setDirection({ x: 0, y: -1 });
            directionRef.current = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) {
            setDirection({ x: 0, y: 1 });
            directionRef.current = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) {
            setDirection({ x: -1, y: 0 });
            directionRef.current = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) {
            setDirection({ x: 1, y: 0 });
            directionRef.current = { x: 1, y: 0 };
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isPaused, gameOver]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      const currentSnake = snakeRef.current;
      const currentDir = directionRef.current;
      const currentFood = foodRef.current;

      const head = currentSnake[0];
      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      if (currentSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        const newScore = scoreRef.current + 10;
        setScore(newScore);
        if (newScore > highScoreRef.current) {
          setHighScore(newScore);
        }
        const nextFood = generateFood(newSnake);
        setFood(nextFood);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameLoop = setInterval(moveSnake, SPEED);
    return () => clearInterval(gameLoop);
  }, [hasStarted, isPaused, gameOver, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto relative">
      <div className="w-full flex justify-between items-center mb-6 bg-[#000] border-4 border-[#f0f] p-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-[#0ff] text-xl font-bold uppercase tracking-widest mb-1">SCORE_</span>
          <span className="text-4xl font-mono text-[#f0f] tracking-widest glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#f0f] text-xl font-bold uppercase tracking-widest mb-1">
            HI_SCORE_
          </span>
          <span className="text-4xl font-mono text-[#0ff] tracking-widest">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-square bg-[#000] border-4 border-[#0ff] overflow-hidden z-10">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(to right, #f0f 1px, transparent 1px), linear-gradient(to bottom, #f0f 1px, transparent 1px)`,
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {hasStarted && (
          <>
            <div
              className="absolute bg-[#fff] border-2 border-[#f0f] animate-pulse"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
              }}
            />

            {snake.map((segment, index) => {
              const isHead = index === 0;
              return (
                <div
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`absolute ${
                    isHead 
                      ? 'bg-[#f0f] border-2 border-[#0ff] z-10' 
                      : 'bg-[#0ff] border border-[#000]'
                  }`}
                  style={{
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                  }}
                />
              );
            })}
          </>
        )}

        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#000]/80 z-20">
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-[#0ff] text-[#000] font-mono text-2xl uppercase border-4 border-[#f0f] hover:bg-[#f0f] hover:text-[#0ff] hover:border-[#0ff] transition-colors cursor-pointer"
            >
              [ INIT_SEQ ]
            </button>
          </div>
        )}

        {isPaused && !gameOver && hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#000]/80 z-20">
            <div className="text-5xl font-mono text-[#f0f] tracking-widest glitch-text" data-text="HALT">
              HALT
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#000]/90 z-20">
            <h2 className="text-5xl font-mono text-[#f0f] mb-4 glitch-text" data-text="FATAL_ERR">
              FATAL_ERR
            </h2>
            <p className="text-[#0ff] mb-8 font-mono text-2xl">SCORE: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-[#f0f] text-[#000] font-mono text-2xl uppercase border-4 border-[#0ff] hover:bg-[#0ff] hover:text-[#f0f] hover:border-[#f0f] transition-colors cursor-pointer"
            >
              [ REBOOT ]
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-[#0ff] text-xl font-sans text-center relative z-10 bg-[#000] p-2 border-2 border-[#f0f]">
        INPUT: <span className="text-[#f0f]">W A S D</span> // <span className="text-[#f0f]">ARROWS</span><br/>
        INTERRUPT: <span className="text-[#f0f]">SPACE</span>
      </div>
    </div>
  );
}
