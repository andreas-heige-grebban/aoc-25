import type { Area, PuzzleInput, RedTile, RedTiles, TilePair } from './types';
/**
 * Parse puzzle input into red tile coordinates
 * @example "7,1\n11,5" → [{ x: 7, y: 1 }, { x: 11, y: 5 }]
 */
export const parseInput = (input: PuzzleInput): RedTiles =>
  input.split('\n').map((line): RedTile => {
    const [x, y] = line.split(',').map(Number);
    return { x: x!, y: y! };
  });
/**
 * Generate all unique pairs from an array (combinations without repetition)
 * For n items, produces n×(n-1)/2 pairs
 */
const pairs = <T>(items: readonly T[]): readonly (readonly [T, T])[] =>
  items.flatMap((item, index) =>
    items.slice(index + 1).map((other): readonly [T, T] => [item, other])
  );

/**
 * Calculate rectangle area with two tiles as opposite corners (INCLUSIVE)
 *
 * Formula: Area = (|x₂ - x₁| + 1) × (|y₂ - y₁| + 1)
 *
 * The +1 accounts for inclusive boundaries (tiles occupy space)
 * @example (2,5) to (11,1) → (9+1) × (4+1) = 10 × 5 = 50
 */
export const rectangleArea = (corner1: RedTile, corner2: RedTile): Area => {
  const width = Math.abs(corner2.x - corner1.x) + 1;
  const height = Math.abs(corner2.y - corner1.y) + 1;

  return width * height;
};

/**
 * Part 1: Find the largest possible rectangle screen
 *
 * Strategy: Brute force O(n²) - check all tile pairs as potential corners
 * For each pair, calculate the inclusive rectangle area
 */
export const part1 = (input: PuzzleInput): Area => {
  const tiles = parseInput(input);
  const cornerPairs = pairs(tiles);
  const areas = cornerPairs.map(
    ([corner1, corner2]: TilePair) => rectangleArea(corner1, corner2)
  );

  // Using reduce instead of Math.max(...areas) to avoid stack overflow
  // with large arrays (spread operator hits call stack limit)
  return areas.reduce((max, area) => (area > max ? area : max), 0);
};

