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

/* ═══════════════════════════════════════════════════════════════════════════
 *                              🟢 PART 2: Green Tiles
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get all tiles on a straight line between two points (EXCLUSIVE of endpoints)
 * Points must be on same row or column (horizontal/vertical line only)
 */
export const getLineTiles = (from: RedTile, to: RedTile): RedTile[] => {
  const tiles: RedTile[] = [];

  if (from.y === to.y) {
    // Horizontal line
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);
    for (let x = minX + 1; x < maxX; x++) {
      tiles.push({ x, y: from.y });
    }
  } else if (from.x === to.x) {
    // Vertical line
    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);
    for (let y = minY + 1; y < maxY; y++) {
      tiles.push({ x: from.x, y });
    }
  }

  return tiles;
};

/**
 * Get all green tiles on the edges of the loop (between consecutive red tiles)
 * The loop wraps: last tile connects back to first
 */
export const getEdgeTiles = (redTiles: RedTiles): RedTile[] => {
  const edgeTiles: RedTile[] = [];

  for (let i = 0; i < redTiles.length; i++) {
    const current = redTiles[i]!;
    const next = redTiles[(i + 1) % redTiles.length]!;
    edgeTiles.push(...getLineTiles(current, next));
  }

  return edgeTiles;
};

/** Convert tile to string key for Set operations */
const tileKey = (tile: RedTile): string => `${tile.x},${tile.y}`;

/**
 * Build boundary set (red tiles + edge tiles only) for point-in-polygon tests
 */
const buildBoundarySet = (redTiles: RedTiles): Set<string> => {
  const boundary = new Set<string>();

  for (const tile of redTiles) {
    boundary.add(tileKey(tile));
  }

  const edgeTiles = getEdgeTiles(redTiles);
  for (const tile of edgeTiles) {
    boundary.add(tileKey(tile));
  }

  return boundary;
};

/**
 * Build a set of vertical edge segments for ray casting
 * Each segment is stored as "x,yMin,yMax"
 */
const buildVerticalSegments = (redTiles: RedTiles): Map<number, [number, number][]> => {
  const segments = new Map<number, [number, number][]>();

  for (let i = 0; i < redTiles.length; i++) {
    const current = redTiles[i]!;
    const next = redTiles[(i + 1) % redTiles.length]!;

    if (current.x === next.x) {
      // Vertical segment
      const x = current.x;
      const yMin = Math.min(current.y, next.y);
      const yMax = Math.max(current.y, next.y);

      if (!segments.has(x)) segments.set(x, []);
      segments.get(x)!.push([yMin, yMax]);
    }
  }

  return segments;
};

/**
 * Check if a point is inside or on the polygon boundary using ray casting
 * Uses the "lower endpoint inclusive" rule for handling vertices
 */
const isInsideOrOnBoundary = (
  x: number,
  y: number,
  boundary: Set<string>,
  verticalSegments: Map<number, [number, number][]>
): boolean => {
  // Check if on boundary
  if (boundary.has(`${x},${y}`)) return true;

  // Ray casting: count vertical segment crossings to the left
  // Rule: count crossing if yMin <= y < yMax (include bottom, exclude top)
  let crossings = 0;

  for (const [segX, segs] of verticalSegments) {
    if (segX >= x) continue; // Only count segments to the left

    for (const [yMin, yMax] of segs) {
      // Include lower endpoint, exclude upper endpoint
      if (y >= yMin && y < yMax) {
        crossings++;
      }
    }
  }

  return crossings % 2 === 1; // Odd = inside
};

/**
 * Build horizontal segments from the polygon
 */
const buildHorizontalSegments = (redTiles: RedTiles): Map<number, [number, number][]> => {
  const segments = new Map<number, [number, number][]>();

  for (let i = 0; i < redTiles.length; i++) {
    const current = redTiles[i]!;
    const next = redTiles[(i + 1) % redTiles.length]!;

    if (current.y === next.y) {
      const y = current.y;
      const xMin = Math.min(current.x, next.x);
      const xMax = Math.max(current.x, next.x);

      if (!segments.has(y)) segments.set(y, []);
      segments.get(y)!.push([xMin, xMax]);
    }
  }

  return segments;
};

/**
 * Check if a rectangle is valid using edge-crossing detection
 * A rectangle is valid if:
 * 1. All 4 corners are inside or on boundary
 * 2. No polygon edges cross through the rectangle interior
 */
export const isValidRectangle = (
  corner1: RedTile,
  corner2: RedTile,
  boundary: Set<string>,
  verticalSegments: Map<number, [number, number][]>,
  horizontalSegments: Map<number, [number, number][]>
): boolean => {
  const minX = Math.min(corner1.x, corner2.x);
  const maxX = Math.max(corner1.x, corner2.x);
  const minY = Math.min(corner1.y, corner2.y);
  const maxY = Math.max(corner1.y, corner2.y);

  // Check all 4 corners are inside or on boundary
  const corners = [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: minX, y: maxY },
    { x: maxX, y: maxY },
  ];

  for (const corner of corners) {
    if (!isInsideOrOnBoundary(corner.x, corner.y, boundary, verticalSegments)) {
      return false;
    }
  }

  // Check no vertical polygon segments cross the interior horizontally
  // A vertical segment at x crosses if: minX < x < maxX AND segment overlaps [minY, maxY]
  for (const [segX, segs] of verticalSegments) {
    if (segX <= minX || segX >= maxX) continue; // Must be strictly inside

    for (const [segYMin, segYMax] of segs) {
      // Check if segment overlaps with rectangle's y range
      if (segYMin < maxY && segYMax > minY) {
        // Segment crosses through rectangle interior - invalid!
        return false;
      }
    }
  }

  // Check no horizontal polygon segments cross the interior vertically
  for (const [segY, segs] of horizontalSegments) {
    if (segY <= minY || segY >= maxY) continue; // Must be strictly inside

    for (const [segXMin, segXMax] of segs) {
      // Check if segment overlaps with rectangle's x range
      if (segXMin < maxX && segXMax > minX) {
        // Segment crosses through rectangle interior - invalid!
        return false;
      }
    }
  }

  return true;
};

/**
 * Part 2: Find largest rectangle using ONLY red and green tiles
 *
 * Strategy: O(n²) pairs with O(segments) validity check per pair
 * Much faster than checking every tile in the rectangle
 */
export const part2 = (input: PuzzleInput): Area => {
  const redTiles = parseInput(input);
  const boundary = buildBoundarySet(redTiles);
  const verticalSegments = buildVerticalSegments(redTiles);
  const horizontalSegments = buildHorizontalSegments(redTiles);
  const cornerPairs = pairs(redTiles);

  let maxArea = 0;

  for (const [corner1, corner2] of cornerPairs) {
    if (isValidRectangle(corner1, corner2, boundary, verticalSegments, horizontalSegments)) {
      const area = rectangleArea(corner1, corner2);
      if (area > maxArea) maxArea = area;
    }
  }

  return maxArea;
};

