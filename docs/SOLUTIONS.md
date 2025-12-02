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

---

# AOC 2025 Day 2: Gift Shop

## Problem
Find and sum all invalid product IDs within given ranges. An invalid ID is one made of a digit sequence repeated at least twice.

## Solution

**Part 1**: Find IDs made of a sequence repeated exactly twice
- Parse comma-separated ranges in format "start-end"
- For each number in range, convert to string and check if it has even length
- Check if first half equals second half (e.g., 55, 6464, 123123)
- Sum all invalid IDs found

**Part 2**: Find IDs made of a sequence repeated at least twice
- Try all possible pattern lengths from 1 to len/2
- For each length that divides the total length evenly, check if the entire string is that pattern repeated 2+ times
- This catches patterns like: 1111111 (1 seven times), 123123123 (123 three times), 1212121212 (12 five times), etc.
- Sum all invalid IDs found

## Answers
- Part 1: 19574776074
- Part 2: 25912654282
