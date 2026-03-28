import { useState, useCallback, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Frown, Handshake } from 'lucide-react';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { StatsPanel } from './components/StatsPanel';
import {
  createGameState,
  playMove,
  getBestMove,
  type GameState,
  type Player,
  type AIResult,
} from './lib/connect4';

function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>(createGameState());
  const [gameStarted, setGameStarted] = useState(false);

  // Settings
  const [aiDepth, setAiDepth] = useState(5);
  const [playerFirst, setPlayerFirst] = useState(true);

  // Derived state
  const playerColor: Player = playerFirst ? 1 : 2;
  const aiColor: Player = playerFirst ? 2 : 1;
  const isAiTurn = gameStarted && !gameState.winner && !gameState.isDraw && gameState.currentPlayer === aiColor;

  // AI state
  const [isThinking, setIsThinking] = useState(false);
  const [lastAiResult, setLastAiResult] = useState<AIResult | null>(null);

  // Score tracking
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [draws, setDraws] = useState(0);

  // Last move for animation
  const lastMoveRef = useRef<number | null>(null);

  // Handle player move
  const handleColumnClick = useCallback(
    (col: number) => {
      if (!gameStarted || gameState.winner || gameState.isDraw || isAiTurn || isThinking) return;

      const newState = playMove(gameState, col);
      if (newState !== gameState) {
        lastMoveRef.current = col;
        setGameState(newState);
      }
    },
    [gameStarted, gameState, isAiTurn, isThinking]
  );

  // AI move
  useEffect(() => {
    if (!isAiTurn || isThinking) return;

    setIsThinking(true);

    // Use setTimeout to allow UI to update before AI calculation
    const timeoutId = setTimeout(() => {
      const result = getBestMove(gameState.board, aiColor, aiDepth);
      setLastAiResult(result);

      if (result.column !== -1) {
        const newState = playMove(gameState, result.column);
        lastMoveRef.current = result.column;
        setGameState(newState);
      }

      setIsThinking(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isAiTurn, gameState, aiColor, aiDepth, isThinking]);

  // Check for game end
  useEffect(() => {
    if (gameState.winner === playerColor) {
      setPlayerWins((prev) => prev + 1);
    } else if (gameState.winner === aiColor) {
      setAiWins((prev) => prev + 1);
    } else if (gameState.isDraw) {
      setDraws((prev) => prev + 1);
    }
  }, [gameState.winner, gameState.isDraw, playerColor, aiColor]);

  // Start game
  const handleStartGame = useCallback(() => {
    setGameState(createGameState());
    setGameStarted(true);
    setLastAiResult(null);
    lastMoveRef.current = null;
  }, []);

  // Reset game
  const handleResetGame = useCallback(() => {
    setGameState(createGameState());
    setGameStarted(false);
    setLastAiResult(null);
    lastMoveRef.current = null;
  }, []);

  // Game over message
  const getGameOverMessage = () => {
    if (gameState.winner === playerColor) {
      return {
        icon: <Trophy className="w-8 h-8 text-[hsl(var(--player-1))]" />,
        text: 'You Win!',
        color: 'text-[hsl(var(--player-1))]',
      };
    }
    if (gameState.winner === aiColor) {
      return {
        icon: <Frown className="w-8 h-8 text-[hsl(var(--player-2))]" />,
        text: 'AI Wins!',
        color: 'text-[hsl(var(--player-2))]',
      };
    }
    if (gameState.isDraw) {
      return {
        icon: <Handshake className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />,
        text: "It's a Draw!",
        color: 'text-[hsl(var(--muted-foreground))]',
      };
    }
    return null;
  };

  const gameOverMessage = getGameOverMessage();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(var(--primary))] bg-opacity-20">
            <Gamepad2 className="w-8 h-8 text-[hsl(var(--primary))]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              Connect 4 AI
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Minimax algorithm with alpha-beta pruning
            </p>
          </div>
        </div>

        {/* Stats Panel */}
        <StatsPanel
          lastAiResult={lastAiResult}
          playerWins={playerWins}
          aiWins={aiWins}
          draws={draws}
        />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Controls */}
          <div className="lg:w-[280px] flex-shrink-0">
            <Controls
              aiDepth={aiDepth}
              setAiDepth={setAiDepth}
              playerFirst={playerFirst}
              setPlayerFirst={setPlayerFirst}
              gameStarted={gameStarted}
              gameOver={!!gameState.winner || gameState.isDraw}
              onStartGame={handleStartGame}
              onResetGame={handleResetGame}
              currentPlayer={gameState.currentPlayer}
              isAiTurn={isAiTurn}
              isThinking={isThinking}
            />
          </div>

          {/* Game Board */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Game Over Overlay */}
            {gameOverMessage && (
              <div className="mb-4 flex items-center gap-3 px-6 py-3 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))]">
                {gameOverMessage.icon}
                <span className={`text-xl font-bold ${gameOverMessage.color}`}>
                  {gameOverMessage.text}
                </span>
              </div>
            )}

            {/* Board */}
            <Board
              board={gameState.board}
              onColumnClick={handleColumnClick}
              winningCells={gameState.winningCells}
              disabled={!gameStarted || !!gameState.winner || gameState.isDraw || isAiTurn}
              lastMove={lastMoveRef.current}
            />

            {/* Start prompt */}
            {!gameStarted && (
              <p className="mt-4 text-[hsl(var(--muted-foreground))] text-sm">
                Configure settings and click "Start Game" to begin
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[hsl(var(--muted-foreground))] pt-4">
          <p>
            The AI uses minimax with alpha-beta pruning to search the game tree. Higher depth = stronger AI but slower moves.
          </p>
        </div>
        <footer className="mt-8 py-4 text-center text-xs text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))]">
          Made by{' '}
          <a 
            href="https://github.com/sharziki" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[hsl(var(--primary))] hover:underline"
          >
            Sharvil Saxena
          </a>
        </footer>

      </div>
    </div>
  );
}

export default App;