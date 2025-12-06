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

---

# AOC 2025 Day 3: Lobby Escalator

## Problem
From banks of batteries (lines of digits), find the largest number that can be formed by selecting a specific number of digits while preserving their original order.

## Solution
The core of the problem is to find the largest possible number by selecting N digits from a string without reordering them. This was solved with a generic, greedy function `findMaxJoltage(bank, numDigits)`.

The function iterates `numDigits` times. In each iteration `i`, it scans for the largest possible digit it can pick from the remaining part of the string, while ensuring there are still enough characters left for the rest of the digits to be selected. This largest digit is appended to the result, and the search for the next digit continues from the position immediately after the picked digit.

`BigInt` was necessary to handle the large numbers involved, especially in Part 2.

**Part 1**: Select exactly 2 digits from each bank.
- The `findMaxJoltage` function is called with `numDigits = 2`.
- The results from all banks are summed up.

**Part 2**: Select exactly 12 digits from each bank.
- The `findMaxJoltage` function is called with `numDigits = 12`.
- The results are summed using `BigInt` to prevent overflow.

## Answers
- Part 1: 17207
- Part 2: 170997883706617

---

# AOC 2025 Day 4: Paper Warehouse

## Problem
Count paper rolls (`@`) that are accessible by forklifts in a warehouse grid. A roll is accessible if it has fewer than 4 adjacent rolls (including diagonals).

## Solution
This problem required counting neighbors in a 2D grid with proper bounds checking.

**Part 1**: Count all rolls with fewer than 4 adjacent neighbors
- Iterate through every cell in the grid
- For each `@`, count its adjacent neighbors in all 8 directions (including diagonals)
- A roll is accessible if it has fewer than 4 neighbors
- Implemented with clear helper functions: `countAdjacentRolls` and `countAccessibleRolls`

**Part 2**: Simulate iterative removal of accessible rolls
- This is a simulation problem: repeatedly find and remove accessible rolls until none remain
- Each iteration:
  1. Find all rolls with < 4 neighbors (using `findRemovableRolls`)
  2. If none found, stop
  3. Add count to total and remove them from grid
  4. Repeat (newly isolated rolls may become accessible)
- Required a mutable grid copy (`[][]byte`) to allow in-place modifications
- Used helper function `countNeighbors` to check adjacency on the mutable grid
- The key insight is that removing rolls can expose new rolls that were previously inaccessible

## Implementation Notes
- Refactored for clarity by extracting nested logic into focused helper functions
- Used descriptive variable names throughout (e.g., `adjacentRollsCount` instead of `adj`)
- Part 2 required careful separation of concerns: finding removable rolls vs. actually removing them

## Answers
- Part 1: 1416
- Part 2: 9086

---

# AOC 2025 Day 5: Cafeteria

## Problem
The Elves need help with their new inventory management system. Given a database with fresh ingredient ID ranges and a list of available ingredient IDs, determine which ingredients are fresh.

## Solution
TypeScript solution with a focus on clean, functional code.

**Part 1**: Count available ingredients that are fresh
- Parse the input into ranges (e.g., `3-5` means IDs 3, 4, 5 are fresh) and available IDs
- For each available ID, check if it falls within any fresh range
- Count how many available IDs are fresh using `filter` and `some`

**Part 2**: Count all unique IDs covered by the fresh ranges
- Initial naive approach (using a Set to store all IDs) failed due to huge ranges exceeding Set max size
- Solution: Merge overlapping ranges, then sum their sizes
- Sort ranges by start position
- Merge adjacent/overlapping ranges (if previous end >= current start - 1)
- Sum up `(end - start + 1)` for each merged range

## Implementation Notes
- Started with explicit for loops and types, then refactored to functional style
- Used `reduce` for merging ranges and summing totals
- Set up monorepo structure with shared ESLint and TypeScript config at root level
- Final code: ~55 lines with single-expression arrow functions

## Answers
- Part 1: 733
- Part 2: 345821388687084

---

# AOC 2025 Day 6: Trash Compactor

## Problem
Parse a worksheet containing math problems arranged vertically in columns. Each problem has numbers stacked vertically with an operator (`+` or `*`) at the bottom. Problems are separated by columns of spaces.

## Solution
TypeScript solution parsing a 2D grid of characters into math problems.

**Part 1**: Read numbers horizontally (left to right per row)
- Split input into lines and identify problem columns (non-empty columns)
- Group consecutive non-space columns as problems
- For each problem: extract horizontal digits per row as numbers, last row contains operator
- Apply operator and sum all results

**Part 2**: Read numbers column-by-column (top digit = most significant)
- Same column grouping, but read digits vertically within each problem column
- For each column in a problem (right to left), build number from top to bottom
- Example: column with `1`, `4`, `6` vertically = 146
- Apply operator and sum all results

## Implementation Notes
- Used TypeScript types: `type Operator = '+' | '*'`, `type Problem = { numbers: number[]; operator: Operator }`, `type ParsedInput` for shared state
- Extracted shared parsing into `parseInput()` returning `ParsedInput` with `lines`, `operatorLine`, `numberLines`, `problemRanges`, `width`, `paddedNumberLines`
- `getOperator()` helper extracts operator detection
- Part-specific parsers (`parseProblemsPart1`, `parseProblemsPart2`) use destructuring from `ParsedInput`
- Functional approach with `map`, `filter`, `reduce`
- Tested with both `tsx` (fast dev) and `tsgo` (Go-based compiler)

## Answers
- Part 1: 5361735137219
- Part 2: 11744693538946

