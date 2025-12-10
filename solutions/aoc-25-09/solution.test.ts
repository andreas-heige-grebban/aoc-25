import { describe, it, expect } from 'vitest';
import {
  parseInput,
  rectangleArea,
  part1,
  getLineTiles,
  getEdgeTiles,
  part2,
} from './solution';
import type { RedTile } from './types';
import { example } from './fixtures';

describe('parseInput', () => {
  it('parses single coordinate', () => {
    expect(parseInput('7,1')).toEqual([{ x: 7, y: 1 }]);
  });

  it('parses example', () => {
    const points = parseInput(example);
    expect(points).toHaveLength(8);
    expect(points[0]).toEqual({ x: 7, y: 1 });
  });
});

describe('rectangleArea', () => {
  it('calculates area between two points (inclusive)', () => {
    // (2,5) to (11,1) = (|11-2|+1) × (|1-5|+1) = 10 × 5 = 50
    expect(rectangleArea({ x: 2, y: 5 }, { x: 11, y: 1 })).toBe(50);
  });

  it('handles same point (1×1 area)', () => {
    expect(rectangleArea({ x: 3, y: 3 }, { x: 3, y: 3 })).toBe(1);
  });

  it('handles horizontal line', () => {
    // (0,0) to (4,0) = 5 × 1 = 5
    expect(rectangleArea({ x: 0, y: 0 }, { x: 4, y: 0 })).toBe(5);
  });
});

describe('part1', () => {
  it('finds largest rectangle from example', () => {
    expect(part1(example)).toBe(50);
  });
});

describe('getLineTiles', () => {
  it('returns tiles between horizontal points (exclusive of endpoints)', () => {
    // 7,1 to 11,1 → green tiles at 8,1  9,1  10,1
    const tiles = getLineTiles({ x: 7, y: 1 }, { x: 11, y: 1 });
    expect(tiles).toEqual([
      { x: 8, y: 1 },
      { x: 9, y: 1 },
      { x: 10, y: 1 },
    ]);
  });

  it('returns tiles between vertical points (exclusive of endpoints)', () => {
    // 11,1 to 11,7 → green tiles at 11,2  11,3  11,4  11,5  11,6
    const tiles = getLineTiles({ x: 11, y: 1 }, { x: 11, y: 7 });
    expect(tiles).toEqual([
      { x: 11, y: 2 },
      { x: 11, y: 3 },
      { x: 11, y: 4 },
      { x: 11, y: 5 },
      { x: 11, y: 6 },
    ]);
  });

  it('returns empty for adjacent tiles', () => {
    const tiles = getLineTiles({ x: 5, y: 5 }, { x: 6, y: 5 });
    expect(tiles).toEqual([]);
  });
});

describe('getEdgeTiles', () => {
  it('returns all green tiles on the loop edges', () => {
    // Simple square: 4 corners, each edge has 1 tile between
    const redTiles: RedTile[] = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ];
    const edges = getEdgeTiles(redTiles);
    // Edge 0→1: (1,0), Edge 1→2: (2,1), Edge 2→3: (1,2), Edge 3→0: (0,1)
    expect(edges).toHaveLength(4);
    expect(edges).toContainEqual({ x: 1, y: 0 });
    expect(edges).toContainEqual({ x: 2, y: 1 });
    expect(edges).toContainEqual({ x: 1, y: 2 });
    expect(edges).toContainEqual({ x: 0, y: 1 });
  });
});

describe('part2', () => {
  it('finds largest valid rectangle from example', () => {
    // Expected answer from problem: 24
    expect(part2(example)).toBe(24);
  });
});
