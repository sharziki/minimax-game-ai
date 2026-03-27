import { memo } from 'react';
import { Play, RotateCcw, User, Bot, Zap } from 'lucide-react';
import type { Player } from '../lib/connect4';

interface ControlsProps {
  aiDepth: number;
  setAiDepth: (depth: number) => void;
  playerFirst: boolean;
  setPlayerFirst: (first: boolean) => void;
  gameStarted: boolean;
  gameOver: boolean;
  onStartGame: () => void;
  onResetGame: () => void;
  currentPlayer: Player;
  isAiTurn: boolean;
  isThinking: boolean;
}

export const Controls = memo(function Controls({
  aiDepth,
  setAiDepth,
  playerFirst,
  setPlayerFirst,
  gameStarted,
  gameOver,
  onStartGame,
  onResetGame,
  currentPlayer,
  isAiTurn,
  isThinking,
}: ControlsProps) {
  return (
    <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-4 space-y-5">
      {/* Turn indicator */}
      <div className="text-center">
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">
          Current Turn
        </p>
        <div
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg
            ${currentPlayer === 1 ? 'bg-[hsl(var(--player-1))] bg-opacity-20' : 'bg-[hsl(var(--player-2))] bg-opacity-20'}
            ${isThinking ? 'ai-thinking' : ''}
          `}
        >
          {isAiTurn ? (
            <>
              <Bot className={`w-5 h-5 ${currentPlayer === 1 ? 'text-[hsl(var(--player-1))]' : 'text-[hsl(var(--player-2))]'}`} />
              <span className={currentPlayer === 1 ? 'text-[hsl(var(--player-1))]' : 'text-[hsl(var(--player-2)))]'}>
                {isThinking ? 'AI Thinking...' : 'AI'}
              </span>
            </>
          ) : (
            <>
              <User className={`w-5 h-5 ${currentPlayer === 1 ? 'text-[hsl(var(--player-1))]' : 'text-[hsl(var(--player-2))]'}`} />
              <span className={currentPlayer === 1 ? 'text-[hsl(var(--player-1))]' : 'text-[hsl(var(--player-2))]'}>
                Your Turn
              </span>
            </>
          )}
        </div>
      </div>

      {/* AI Settings */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-[hsl(var(--primary))]" />
          <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">AI Settings</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">
              Search Depth: {aiDepth}
            </label>
            <input
              type="range"
              min={1}
              max={8}
              value={aiDepth}
              onChange={(e) => setAiDepth(parseInt(e.target.value))}
              disabled={gameStarted && !gameOver}
              className="w-full accent-[hsl(var(--primary))]"
            />
            <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-[hsl(var(--muted-foreground))] mb-2 block">Who Plays First</label>
            <div className="flex gap-2">
              <button
                onClick={() => setPlayerFirst(true)}
                disabled={gameStarted && !gameOver}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2
                  ${playerFirst ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'}
                  disabled:opacity-50 transition-colors
                `}
              >
                <User className="w-4 h-4" />
                You
              </button>
              <button
                onClick={() => setPlayerFirst(false)}
                disabled={gameStarted && !gameOver}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2
                  ${!playerFirst ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'}
                  disabled:opacity-50 transition-colors
                `}
              >
                <Bot className="w-4 h-4" />
                AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        {!gameStarted || gameOver ? (
          <button
            onClick={onStartGame}
            className="w-full py-2.5 px-4 bg-[hsl(var(--primary))] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[hsl(263,70%,53%)] transition-colors"
          >
            <Play className="w-4 h-4" />
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        ) : (
          <button
            onClick={onResetGame}
            className="w-full py-2.5 px-4 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[hsl(217,33%,22%)] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Game
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-[hsl(var(--border))]">
        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Players</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[hsl(var(--player-1))]" />
            <span className="text-xs text-[hsl(var(--foreground))]">
              {playerFirst ? 'You' : 'AI'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[hsl(var(--player-2))]" />
            <span className="text-xs text-[hsl(var(--foreground))]">
              {playerFirst ? 'AI' : 'You'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
