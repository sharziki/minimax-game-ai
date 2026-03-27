import { memo, useCallback } from 'react';
import type { Board as BoardType, Position } from '../lib/connect4';
import { ROWS, COLS } from '../lib/connect4';

interface BoardProps {
  board: BoardType;
  onColumnClick: (col: number) => void;
  winningCells: Position[];
  disabled: boolean;
  lastMove: number | null;
}

interface CellProps {
  value: 0 | 1 | 2;
  isWinning: boolean;
  isLastMove: boolean;
  onClick: () => void;
  disabled: boolean;
  row: number;
}

const Cell = memo(function Cell({ value, isWinning, isLastMove, onClick, disabled, row }: CellProps) {
  const getPieceColor = () => {
    if (value === 1) return 'bg-[hsl(var(--player-1))]';
    if (value === 2) return 'bg-[hsl(var(--player-2))]';
    return 'bg-[hsl(var(--cell))]';
  };

  const shouldAnimate = isLastMove && value !== 0;

  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== 0}
      className={`
        w-14 h-14 rounded-full board-cell
        ${getPieceColor()}
        ${isWinning ? 'winning-piece' : ''}
        ${shouldAnimate ? 'piece-drop' : ''}
        ${value === 0 && !disabled ? 'hover:bg-[hsl(var(--hover))] cursor-pointer' : ''}
        ${disabled && value === 0 ? 'cursor-not-allowed' : ''}
        transition-all duration-150
        border-2 border-[hsl(var(--board))]
      `}
      style={{
        animationDelay: shouldAnimate ? `${row * 30}ms` : undefined,
      }}
    />
  );
});

export const Board = memo(function Board({
  board,
  onColumnClick,
  winningCells,
  disabled,
  lastMove,
}: BoardProps) {
  const isWinningCell = useCallback(
    (row: number, col: number) => {
      return winningCells.some((pos) => pos.row === row && pos.col === col);
    },
    [winningCells]
  );

  const isLastMoveCell = useCallback(
    (row: number, col: number) => {
      if (lastMove === null) return false;
      // Find the row where the last piece was placed in this column
      for (let r = 0; r < ROWS; r++) {
        if (board[r][col] !== 0) {
          return col === lastMove && r === row;
        }
      }
      return false;
    },
    [board, lastMove]
  );

  return (
    <div className="bg-[hsl(var(--primary))] p-4 rounded-2xl shadow-2xl">
      {/* Column indicators */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {Array.from({ length: COLS }, (_, col) => (
          <button
            key={`indicator-${col}`}
            onClick={() => onColumnClick(col)}
            disabled={disabled || board[0][col] !== 0}
            className={`
              h-8 rounded-lg flex items-center justify-center text-xs font-medium
              ${board[0][col] === 0 && !disabled ? 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--hover))] cursor-pointer' : 'bg-transparent cursor-not-allowed opacity-50'}
              text-[hsl(var(--muted-foreground))]
              transition-colors
            `}
          >
            ↓
          </button>
        ))}
      </div>

      {/* Board grid */}
      <div className="bg-[hsl(var(--board))] p-3 rounded-xl">
        <div className="grid grid-cols-7 gap-2">
          {board.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <Cell
                key={`${rowIdx}-${colIdx}`}
                value={cell}
                isWinning={isWinningCell(rowIdx, colIdx)}
                isLastMove={isLastMoveCell(rowIdx, colIdx)}
                onClick={() => onColumnClick(colIdx)}
                disabled={disabled}
                row={rowIdx}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
});
