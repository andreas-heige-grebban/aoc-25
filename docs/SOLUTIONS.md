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
<details>
<summary>Today's Results</summary>

- Part 1: 964
- Part 2: 5872

</details>

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
<details>
<summary>Today's Results</summary>

- Part 1: 19574776074
- Part 2: 25912654282

</details>

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
<details>
<summary>Today's Results</summary>

- Part 1: 17207
- Part 2: 170997883706617

</details>

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
<details>
<summary>Today's Results</summary>

- Part 1: 1416
- Part 2: 9086

</details>

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
<details>
<summary>Today's Results</summary>

- Part 1: 733
- Part 2: 345821388687084

</details>

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
<details>
<summary>Today's Results</summary>

- Part 1: 5361735137219
- Part 2: 11744693538946

</details>

---

# AOC 2025 Day 7: Laboratories

## Problem
Simulate tachyon beams passing through a manifold grid. A beam enters at `S` and moves downward. When hitting a splitter (`^`), the beam splits into two beams going left and right. Count splits (Part 1) and parallel timelines (Part 2).

## Solution
TypeScript solution with strict typing and functional patterns.

**Part 1**: Count total splitter positions hit
- Parse grid to find start column and dimensions
- Simulate beams row by row, tracking positions in a `Map<Column, TimelineCount>`
- Count unique splitter positions hit (not weighted by timeline count)

**Part 2**: Count total parallel timelines (many-worlds interpretation)
- Same simulation, but track how many timelines are at each position
- When a beam splits, each timeline at that position creates two new timelines
- Final answer is sum of all timeline counts after traversal

## Implementation Notes
- Separated types into `types.ts` with full JSDoc documentation
- Domain types: `Column`, `TimelineCount`, `Grid`, `Manifold`, `Beams`, `RowResult`, `SimState`, `SimResult`
- All types use `Readonly<>` and `ReadonlyMap<>` for immutability
- Generic `Timed<T>` utility type for timing wrapper
- Functional style with `reduce`, [IIFE patterns](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) for clean one-liners
- `timed()` helper wraps functions to measure execution time
- Comments above each function explaining purpose

## TDD Approach
Starting from Part 2, we adopted Test-Driven Development (TDD) for this repository:
- Set up **Vitest** for TypeScript tests and **Go's built-in testing** for Go solutions
- Extracted solution logic into `solution.ts` with exported functions for testability
- Created comprehensive test suites covering parsing, beam mechanics, and full simulation
- Table-driven tests with a reusable `t()` helper for minimal boilerplate
- TDD helps catch edge cases early and makes refactoring safer—especially useful when optimizing AoC solutions

## Answers
<details>
<summary>Today's Results</summary>

- Part 1: 1587
- Part 2: 5748679033029

</details>

---

# AOC 2025 Day 8: Junction Boxes

## Problem
Connect 3D junction boxes using the Union-Find algorithm. Given junction box coordinates in 3D space, connect the closest pairs and analyze the resulting circuits.

## Solution
TypeScript solution using [Union-Find (Disjoint Set Union)](https://javascript.plainenglish.io/understanding-union-find-disjoint-set-union-with-javascript-9e7a23eecf30) data structure with path compression and union by rank optimizations.

**Part 1**: Connect 1000 closest pairs, multiply sizes of top 3 circuits
- Parse 3D coordinates (x,y,z) for each junction box
- Generate all pairs with Euclidean distances, sorted ascending
- Process first 1000 pairs (even if some are already connected)
- Use Union-Find to track connected components (circuits)
- Return product of the three largest circuit sizes

**Part 2**: Find the last pair that connects all boxes into one circuit
- Continue connecting pairs until all boxes form a single circuit
- Track when `circuitsRemaining` drops to 1
- Return product of X coordinates of the final connecting pair

## Key Algorithms
- **Euclidean Distance in 3D**: $d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$
  - Measures straight-line distance between two points in 3D space
  - Used to sort all junction box pairs by proximity
  - Implemented as `Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z - a.z) ** 2)`
- **Union-Find with Path Compression**: `find()` flattens tree on each lookup
  - Each node points to its parent; root points to itself
  - Path compression: during `find()`, make all nodes point directly to root
  - Reduces future lookup time from O(n) to nearly O(1) amortized
- **Union by Rank**: Smaller tree attached under larger tree root
  - Track "rank" (approximate depth) of each tree
  - Always attach smaller tree under larger to keep trees shallow
  - Combined with path compression: O(α(n)) per operation (inverse Ackermann, effectively constant)

## Implementation Notes
- Strict domain types: `Point`, `BoxIndex`, `BoxPair`, `UnionFind`, `PuzzleInput`, `ConnectionCount`, `CircuitSize`, `ProductResult`
- Immutable types with `Readonly<>` for `Point` and `BoxPair`
- Functional style: `flatMap`, `reduce`, destructuring, single-expression functions
- Test fixtures extracted to separate `fixtures.ts` file
- 12 unit tests covering all solution functions

## Answers
<details>
<summary>Today's Results</summary>

- Part 1: 62186
- Part 2: 8420405530

</details>

---

# AOC 2025 Day 9: Movie Theater

## Problem
Find the largest rectangle that can be formed using red floor tiles as corners. The Elves are renovating a movie theater and need to place the largest possible screen on a wall, constrained by the red tile layout.

**Part 1**: Find the largest rectangle area using any two red tiles as opposite corners
**Part 2**: Find the largest rectangle that contains only red and green tiles (green tiles connect the red tiles in a closed loop)

## Solution
TypeScript solution with an important performance optimization story.

**Part 1**: O(n²) brute force - check all red tile pairs
- Parse input into array of red tile coordinates (x,y)
- Check all pairs of red tiles as opposite corners of rectangles
- Rectangle area (inclusive): `(|x2-x1|+1) × (|y2-y1|+1)`
- Track maximum area found

**Part 2**: Valid rectangles only (must contain only red/green tiles)
- Green tiles form the edges connecting red tiles in a closed loop
- A rectangle is "valid" if all tiles inside are either red or green (on the polygon)
- Find maximum area among all valid rectangles

### 🚀 Critical Performance Optimization

The naive Part 2 solution ran for **3+ hours** on real input and never finished!

**The Problem**: With 495 red tiles having coordinates up to ~100,000, rectangles could contain millions of tiles. Checking every tile:
```typescript
// SLOW: O(width × height) per rectangle - millions of tiles!
for (let x = minX; x <= maxX; x++) {
  for (let y = minY; y <= maxY; y++) {
    if (!isInsideOrOnBoundary(boundarySet, x, y)) return false;
  }
}
```

**The Solution**: Edge crossing detection - instead of checking every tile, check if any polygon edge crosses through the rectangle's interior:

```typescript
// FAST: O(n) where n = number of polygon edges
// 1. Check 4 corners are inside polygon (ray casting)
if (!isInsideOrOnBoundary(..., corner1)) return false;
if (!isInsideOrOnBoundary(..., corner2)) return false;
// ... (4 corners total)

// 2. Check no vertical polygon segments cross rectangle interior
for (const segment of verticalSegments) {
  if (segmentCrossesRectangleInterior(segment, rect)) return false;
}

// 3. Check no horizontal polygon segments cross rectangle interior
for (const segment of horizontalSegments) {
  if (segmentCrossesRectangleInterior(segment, rect)) return false;
}
```

**Key Insight**: If all 4 corners are inside the polygon AND no polygon edges cross through the rectangle, then the entire rectangle must be inside the polygon. This reduces complexity from O(width × height) to O(n) where n is the number of polygon edges.

**Result**: **3+ hours → 0.46 seconds** ⚡

### Algorithm Details

**Ray Casting (Point-in-Polygon)**:
- Cast a horizontal ray from the point to infinity
- Count how many polygon edges the ray crosses
- Odd count = inside, even count = outside
- Special handling for vertices using "lower endpoint" rule

**Edge Crossing Detection**:
- Pre-build lists of vertical and horizontal polygon segments
- For each segment, check if it crosses the rectangle's interior (not just corners/edges)
- A vertical segment at x crosses if: `minX < x < maxX` and segment Y range overlaps rectangle Y range
- Similarly for horizontal segments

## Implementation Notes
- Types: `Point/RedTile`, `TilePair`, `Area`, `PuzzleInput`, `Coordinate`
- Helper functions: `getLineTiles`, `getEdgeTiles`, `buildBoundarySet`, `buildVerticalSegments`, `buildHorizontalSegments`, `isInsideOrOnBoundary`
- 11 unit tests covering all functions
- Total execution time: 0.46 seconds for both parts

## Answers
<details>
<summary>Today's Results</summary>

- Part 1: 4776487744
- Part 2: 1560299548

</details>

---

# AOC 2025 Day 10: Factory

## Problem
Solve two variants of button-pressing puzzles on factory machines:
1. **Part 1**: Toggle lights to match a target pattern using minimum button presses
2. **Part 2**: Increment counters to reach joltage targets using minimum button presses

Each machine has buttons that affect multiple lights/counters simultaneously.

## Mathematical Background

### Part 1: GF(2) - Galois Field of Two Elements

**GF(2)** is the simplest finite field, containing only two elements: {0, 1}. Operations work like this:
- **Addition**: XOR (0+0=0, 0+1=1, 1+0=1, 1+1=0)
- **Multiplication**: AND (0×0=0, 0×1=0, 1×0=0, 1×1=1)

Light toggling is XOR: pressing a button twice cancels out (1⊕1=0). This means each button is either pressed 0 or 1 times - there's no benefit to pressing more.

With n buttons where each can be pressed 0 or 1 times, there are exactly **2^n possible combinations**. We use a bitmask to enumerate all of them. This brute force approach is $O(2^n)$ but works well for small n (≤20 buttons).

### Part 2: Integer Linear Programming (ILP)

Part 2 is fundamentally different - counters are **additive** (each press adds 1), not toggles. This is an **Integer Linear Programming** problem:

$$\text{minimize: } \sum_{i} x_i$$
$$\text{subject to: } Ax = b, \quad x \geq 0, \quad x \in \mathbb{Z}$$

Where:
- $x_i$ = number of presses for button $i$
- $A$ = binary matrix (1 if button $j$ affects counter $i$)
- $b$ = target joltage values

### Gaussian Elimination with Rational Arithmetic

We solve this using **Gaussian elimination** to convert the system to **Reduced Row Echelon Form (RREF)**:

1. **Build augmented matrix** $[A | b]$
2. **Forward elimination**: Create upper triangular form
3. **Back substitution**: Reduce to RREF with leading 1s

**Critical insight**: Using floating point arithmetic causes rounding errors that corrupt solutions. We use **exact rational arithmetic** (fractions as numerator/denominator pairs) to maintain precision.

### Free Variables and Search Space

After RREF, variables split into:
- **Pivot (bound) variables**: Determined by other variables
- **Free variables**: Can take any value

If the system has $k$ free variables, we search over all non-negative integer values for those free variables, computing bound variables via back-substitution. We minimize the total sum while ensuring all variables remain non-negative integers.

## Solution

### Part 1: Light Toggle (GF(2) Brute Force)

```
Input: [.##.] (0,1) (1,2) (3)
Target: [off, on, on, off]
Buttons: 
  - Button 0 toggles lights 0,1
  - Button 1 toggles lights 1,2
  - Button 2 toggles light 3
```

Algorithm:
1. Try all $2^n$ button combinations using bitmask enumeration
2. For each combination, simulate the XOR toggles
3. Track minimum presses that achieve target pattern

**Time Complexity**: $O(2^n \cdot m)$ where n=buttons, m=lights
- $2^n$ = number of button combinations to try (each button pressed or not)
- $m$ = work per combination (check each light's state)
- Example: 10 buttons, 8 lights → $2^{10} \cdot 8 = 8192$ operations

### Part 2: Counter Increment (Gaussian Elimination + ILP Search)

```
Input: [.##.] (0,1) (1,2) (3) {3,5,4,7}
Joltage targets: counter[0]=3, counter[1]=5, counter[2]=4, counter[3]=7
```

Algorithm:
1. **Build augmented matrix** from button-counter relationships
2. **Gaussian elimination** with exact rational arithmetic → RREF
3. **Identify free variables** (columns without pivots)
4. **If no free variables**: Direct solution via back-substitution
5. **If free variables exist**: Search over free variable space with pruning
6. **Verify solutions** against original constraints (guards against floating point edge cases)

**Time Complexity**: $O(m \cdot n^2)$ for RREF + $O(maxVal^k)$ for $k$ free variables
- **RREF phase**: $O(m \cdot n^2)$
  - $m$ = rows (counters), $n$ = columns (buttons)
  - For each of $n$ columns, we do $O(m)$ row operations, each touching $O(n)$ elements
- **Search phase**: $O(maxVal^k)$ where $k$ = number of free variables
  - $maxVal$ = search range (typically $2 \times \max(targets)$)
  - $k$ = variables not determined by RREF (usually 0-3 for this puzzle)
  - Example: 3 free vars, maxVal=200 → $200^3 = 8M$ combinations
- **Total**: Dominated by search phase when $k > 0$

## Implementation Notes

- **Parsing**: Regex-based extraction of `[.##.]`, `(x,y)`, and `{a,b,c}` patterns
- **Part 1**: Brute force bitmask enumeration over GF(2)
- **Part 2**: Gaussian elimination with exact fractions, then ILP search on free variables
- **Verification**: All computed solutions are verified against original constraints
- **13 unit tests** covering parsing, solving, and both parts

## Answers
<details>
<summary>Today's Results</summary>

- Part 1: 527 (0.02s)
- Part 2: 19810 (~3s)

</details>