# Advent of Code 2025 🎄

Solutions for [Advent of Code 2025](https://adventofcode.com/2025) in TypeScript (to improve knowledge) and Go (for learning).

## Structure

```
solutions/
└── aoc-25-XX/        # Each day's solution
    ├── main.ts|go    # Entry point
    ├── solution.ts   # Core logic (TS)
    ├── types.ts      # Type definitions (TS)
    ├── solution.test.ts|main_test.go
    └── input.txt
utils/                # Shared TS utilities
docs/                 # Solution notes
```

## Setup

```bash
nvm use           # Node 24+
npm install
```

## Commands

```bash
# Run a day's solution (TS)
cd solutions/aoc-25-xx && npx tsx main.ts

# Run a day's solution (Go)
cd solutions/aoc-25-xx && go run main.go

# Run all tests (TS + Go)
npm run test:all

# Run only TS tests
npm test

# Run only Go tests
npm run test:go
```

## Progress

<img width="657" height="613" alt="image" src="https://github.com/user-attachments/assets/1a946767-ba66-4608-8414-073192b1ada0" />


## Tech Stack

- **TypeScript 5.9** with ES2024 target
- **Go 1.23+**
- **Vitest** for TS testing
- **tsx** for running TS directly
