import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2; // Milliseconds to subtract per food eaten

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

const getRandomPosition = (): Point => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  };
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [direction, setDirection] = useState<Point>(DIRECTIONS.UP);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const currentDirection = useRef(direction);

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ]);
    setDirection(DIRECTIONS.UP);
    currentDirection.current = DIRECTIONS.UP;
    setFood(getRandomPosition());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!hasStarted && e.key !== ' ') {
        setHasStarted(true);
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused((p) => !p);
        return;
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      if (isPaused || gameOver) return;

      const { x: dx, y: dy } = currentDirection.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (dy !== 1) setDirection(DIRECTIONS.UP);
          break;
        case 'ArrowDown':
        case 's':
          if (dy !== -1) setDirection(DIRECTIONS.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
          if (dx !== 1) setDirection(DIRECTIONS.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
          if (dx !== -1) setDirection(DIRECTIONS.RIGHT);
          break;
      }
    },
    [isPaused, gameOver, hasStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Sync ref with state
  useEffect(() => {
    currentDirection.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isPaused || gameOver || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + currentDirection.current.x,
          y: head.y + currentDirection.current.y
        };

        // Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self Collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          
          let newFood;
          while (true) {
            newFood = getRandomPosition();
            // Ensure food doesn't spawn on snake
            const isOnSnake = newSnake.some(s => s.x === newFood.x && s.y === newFood.y);
            if (!isOnSnake) break;
          }
          setFood(newFood);
        } else {
          newSnake.pop(); // Remove tail if not eating
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
    const interval = setInterval(moveSnake, speed);
    
    return () => clearInterval(interval);
  }, [direction, food, isPaused, gameOver, hasStarted, score, highScore]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[600px] shrink-0">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <div className="flex flex-col">
          <span className="font-mono text-xs uppercase tracking-widest text-[#00ffcc]/60">Score</span>
          <span className="font-mono text-3xl font-bold neon-text">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff00ff]/60">High Score</span>
          <span className="font-mono text-3xl font-bold neon-text-magenta">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full aspect-square bg-[#050505] neon-border rounded-xl flex items-center justify-center overflow-hidden shadow-2xl">
        
        {/* The Grid Render */}
        <div 
          className="w-full h-full grid"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full border border-white/[0.02]
                  ${isHead ? 'bg-[#00ffcc] shadow-[0_0_10px_#00ffcc] rounded-sm relative z-10' : ''}
                  ${!isHead && isSnake ? 'bg-[#00ffcc]/80 shadow-[0_0_5px_#00ffcc]/50 rounded-sm' : ''}
                  ${isFood ? 'bg-[#ff00ff] shadow-[0_0_12px_#ff00ff] animate-pulse rounded-full scale-75' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlay - Start Menu */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h2 className="text-4xl font-black italic tracking-widest text-white mb-2 uppercase">Cyber <span className="text-[#00ffcc] neon-text">Snake</span></h2>
            <p className="font-mono text-sm text-gray-400 mb-8 max-w-[200px] text-center leading-relaxed">
              Use arrow keys or WASD to navigate. Space to pause.
            </p>
            <button 
              onClick={() => setHasStarted(true)}
              className="px-8 py-3 bg-transparent border-2 border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-black font-bold uppercase tracking-widest neon-text hover:shadow-[0_0_20px_#00ffcc] transition-all rounded-md"
            >
              Start System
            </button>
          </div>
        )}

        {/* Overlay - Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h2 className="text-5xl font-black text-[#ff00ff] neon-text-magenta mb-2 uppercase tracking-wide">System Crash</h2>
            <p className="font-mono text-xl text-white mb-8">Final Score: <span className="text-[#00ffcc] neon-text">{score}</span></p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-transparent border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black font-bold uppercase tracking-widest neon-text hover:shadow-[0_0_20px_#ff00ff] transition-all rounded-md"
            >
              Reboot (Enter)
            </button>
          </div>
        )}

        {/* Overlay - Paused */}
        {isPaused && !gameOver && hasStarted && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h2 className="text-4xl font-bold text-white tracking-[0.2em] uppercase">Paused</h2>
            <p className="font-mono text-gray-400 mt-4 text-sm">Press SPACE to resume</p>
          </div>
        )}
      </div>

    </div>
  );
}
