# Connect 4 AI

Play Connect 4 against an AI opponent powered by the minimax algorithm with alpha-beta pruning. Watch the AI think through thousands of game positions to find optimal moves.

## Features

- **Minimax Algorithm**: Classic game tree search with configurable depth
- **Alpha-Beta Pruning**: Optimization that cuts off unnecessary branches
- **Adjustable Difficulty**: Search depth from 1 (easy) to 8 (hard)
- **Real-time Stats**: See nodes evaluated, search depth, computation time
- **Score Tracking**: Keep track of wins, losses, and draws
- **Animated Pieces**: Smooth drop animations and winning highlights
- **Choose First Player**: Start as first or second player

## How It Works

### Minimax Algorithm
The AI builds a game tree of all possible future moves and evaluates each branch:
- **Maximizing**: AI assumes it will play optimally to maximize its score
- **Minimizing**: AI assumes you will play optimally to minimize its score
- Recursively explores down to the configured depth

### Alpha-Beta Pruning
Optimizes minimax by eliminating branches that cannot affect the final decision:
- **Alpha**: Best score the maximizer can guarantee
- **Beta**: Best score the minimizer can guarantee
- When beta ≤ alpha, remaining branches are pruned

### Position Evaluation
When search depth is reached, positions are scored based on:
- Center column control (strategic advantage)
- Connected piece patterns (2-in-a-row, 3-in-a-row)
- Threat detection (blocking opponent wins)

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

## Controls

1. Set AI search depth (higher = stronger but slower)
2. Choose who plays first
3. Click "Start Game"
4. Click a column to drop your piece
5. Watch the AI respond!

## Performance

| Depth | Difficulty | Avg. Nodes | Response Time |
|-------|------------|------------|---------------|
| 1-2   | Easy       | ~50        | Instant       |
| 3-4   | Medium     | ~2,000     | < 100ms       |
| 5-6   | Hard       | ~50,000    | < 500ms       |
| 7-8   | Expert     | ~500,000+  | 1-5 seconds   |

## License

MIT
