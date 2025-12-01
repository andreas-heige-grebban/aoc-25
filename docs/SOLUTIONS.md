# AOC 2025 Day 1: Secret Entrance

## Problem
Count how many times a dial (0-99, circular) lands on position 0 while following rotation instructions.

## Solution
The dial is circular (0-99) and rotations wrap around. We start at position 50.

**Part 1**: Count times the dial ends a rotation at position 0
- Parse each instruction (direction L/R + distance)
- Apply rotation with proper circular wrapping: `((position % 100) + 100) % 100`
- Increment counter when final position is 0

**Part 2**: Count all clicks that land on 0 (during AND at end of rotations)
- For each rotation, simulate each individual click
- Count intermediate zeros (every time dial passes through a multiple of 100)
- Don't double-count the final position (it's counted separately)
- Add end-of-rotation zeros to intermediate count

## Answers
- Part 1: 964
- Part 2: 5872
