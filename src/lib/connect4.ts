// Connect 4 Game Logic and Minimax AI with Alpha-Beta Pruning

export const ROWS = 6;
export const COLS = 7;
export const CONNECT = 4;

export type Player = 1 | 2;
export type Cell = 0 | Player;
export type Board = Cell[][];

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  winningCells: Position[];
  moveHistory: number[];
}

export interface AIResult {
  column: number;
  score: number;
  nodesEvaluated: number;
  depth: number;
  timeMs: number;
}

// Create empty board
export function createBoard(): Board {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(0));
}

// Create initial game state
export function createGameState(): GameState {
  return {
    board: createBoard(),
    currentPlayer: 1,
    winner: null,
    isDraw: false,
    winningCells: [],
    moveHistory: [],
  };
}

// Clone board
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

// Get valid columns (not full)
export function getValidColumns(board: Board): number[] {
  const valid: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === 0) {
      valid.push(col);
    }
  }
  return valid;
}

// Get next available row in column
export function getNextRow(board: Board, col: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      return row;
    }
  }
  return -1;
}

// Make a move
export function makeMove(board: Board, col: number, player: Player): Board | null {
  const row = getNextRow(board, col);
  if (row === -1) return null;

  const newBoard = cloneBoard(board);
  newBoard[row][col] = player;
  return newBoard;
}

// Check for winner
export function checkWinner(board: Board): { winner: Player | null; winningCells: Position[] } {
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const player = board[row][col];
      if (player !== 0) {
        let win = true;
        for (let i = 1; i < CONNECT; i++) {
          if (board[row][col + i] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return {
            winner: player,
            winningCells: Array.from({ length: CONNECT }, (_, i) => ({ row, col: col + i })),
          };
        }
      }
    }
  }

  // Vertical
  for (let row = 0; row <= ROWS - CONNECT; row++) {
    for (let col = 0; col < COLS; col++) {
      const player = board[row][col];
      if (player !== 0) {
        let win = true;
        for (let i = 1; i < CONNECT; i++) {
          if (board[row + i][col] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return {
            winner: player,
            winningCells: Array.from({ length: CONNECT }, (_, i) => ({ row: row + i, col })),
          };
        }
      }
    }
  }

  // Diagonal (down-right)
  for (let row = 0; row <= ROWS - CONNECT; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const player = board[row][col];
      if (player !== 0) {
        let win = true;
        for (let i = 1; i < CONNECT; i++) {
          if (board[row + i][col + i] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return {
            winner: player,
            winningCells: Array.from({ length: CONNECT }, (_, i) => ({
              row: row + i,
              col: col + i,
            })),
          };
        }
      }
    }
  }

  // Diagonal (up-right)
  for (let row = CONNECT - 1; row < ROWS; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const player = board[row][col];
      if (player !== 0) {
        let win = true;
        for (let i = 1; i < CONNECT; i++) {
          if (board[row - i][col + i] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return {
            winner: player,
            winningCells: Array.from({ length: CONNECT }, (_, i) => ({
              row: row - i,
              col: col + i,
            })),
          };
        }
      }
    }
  }

  return { winner: null, winningCells: [] };
}

// Check if board is full (draw)
export function isBoardFull(board: Board): boolean {
  return board[0].every((cell) => cell !== 0);
}

// Count pieces in a window
function countWindow(window: Cell[], player: Player): { player: number; empty: number; opponent: number } {
  const opponent: Player = player === 1 ? 2 : 1;
  return {
    player: window.filter((c) => c === player).length,
    empty: window.filter((c) => c === 0).length,
    opponent: window.filter((c) => c === opponent).length,
  };
}

// Evaluate a window of cells
function evaluateWindow(window: Cell[], player: Player): number {
  const counts = countWindow(window, player);

  if (counts.player === 4) return 100;
  if (counts.player === 3 && counts.empty === 1) return 5;
  if (counts.player === 2 && counts.empty === 2) return 2;

  if (counts.opponent === 3 && counts.empty === 1) return -4;

  return 0;
}

// Heuristic evaluation function
export function evaluateBoard(board: Board, player: Player): number {
  let score = 0;

  // Center column preference
  const centerCol = Math.floor(COLS / 2);
  const centerCount = board.filter((row) => row[centerCol] === player).length;
  score += centerCount * 3;

  // Horizontal windows
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const window: Cell[] = [];
      for (let i = 0; i < CONNECT; i++) {
        window.push(board[row][col + i]);
      }
      score += evaluateWindow(window, player);
    }
  }

  // Vertical windows
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - CONNECT; row++) {
      const window: Cell[] = [];
      for (let i = 0; i < CONNECT; i++) {
        window.push(board[row + i][col]);
      }
      score += evaluateWindow(window, player);
    }
  }

  // Diagonal (down-right)
  for (let row = 0; row <= ROWS - CONNECT; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const window: Cell[] = [];
      for (let i = 0; i < CONNECT; i++) {
        window.push(board[row + i][col + i]);
      }
      score += evaluateWindow(window, player);
    }
  }

  // Diagonal (up-right)
  for (let row = CONNECT - 1; row < ROWS; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const window: Cell[] = [];
      for (let i = 0; i < CONNECT; i++) {
        window.push(board[row - i][col + i]);
      }
      score += evaluateWindow(window, player);
    }
  }

  return score;
}

// Minimax with Alpha-Beta Pruning
let nodesEvaluated = 0;

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  nodesEvaluated++;

  const { winner } = checkWinner(board);
  const humanPlayer: Player = aiPlayer === 1 ? 2 : 1;

  // Terminal states
  if (winner === aiPlayer) return 10000 + depth;
  if (winner === humanPlayer) return -10000 - depth;
  if (isBoardFull(board)) return 0;
  if (depth === 0) return evaluateBoard(board, aiPlayer);

  const validCols = getValidColumns(board);

  // Order columns by center preference for better pruning
  validCols.sort((a, b) => {
    const centerA = Math.abs(a - Math.floor(COLS / 2));
    const centerB = Math.abs(b - Math.floor(COLS / 2));
    return centerA - centerB;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const col of validCols) {
      const newBoard = makeMove(board, col, aiPlayer);
      if (!newBoard) continue;
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const col of validCols) {
      const newBoard = makeMove(board, col, humanPlayer);
      if (!newBoard) continue;
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
}

// Get best move for AI
export function getBestMove(board: Board, aiPlayer: Player, depth: number = 6): AIResult {
  const startTime = performance.now();
  nodesEvaluated = 0;

  const validCols = getValidColumns(board);
  if (validCols.length === 0) {
    return { column: -1, score: 0, nodesEvaluated: 0, depth, timeMs: 0 };
  }

  // Order columns by center preference
  validCols.sort((a, b) => {
    const centerA = Math.abs(a - Math.floor(COLS / 2));
    const centerB = Math.abs(b - Math.floor(COLS / 2));
    return centerA - centerB;
  });

  let bestCol = validCols[0];
  let bestScore = -Infinity;

  // Check for immediate win or block
  for (const col of validCols) {
    // Check for winning move
    const winBoard = makeMove(board, col, aiPlayer);
    if (winBoard) {
      const { winner } = checkWinner(winBoard);
      if (winner === aiPlayer) {
        return {
          column: col,
          score: 10000,
          nodesEvaluated: 1,
          depth,
          timeMs: performance.now() - startTime,
        };
      }
    }
  }

  // Main minimax search
  for (const col of validCols) {
    const newBoard = makeMove(board, col, aiPlayer);
    if (!newBoard) continue;

    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, aiPlayer);

    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return {
    column: bestCol,
    score: bestScore,
    nodesEvaluated,
    depth,
    timeMs: performance.now() - startTime,
  };
}

// Play a move and update game state
export function playMove(state: GameState, col: number): GameState {
  const newBoard = makeMove(state.board, col, state.currentPlayer);
  if (!newBoard) return state;

  const { winner, winningCells } = checkWinner(newBoard);
  const isDraw = !winner && isBoardFull(newBoard);

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
    winner,
    isDraw,
    winningCells,
    moveHistory: [...state.moveHistory, col],
  };
}
