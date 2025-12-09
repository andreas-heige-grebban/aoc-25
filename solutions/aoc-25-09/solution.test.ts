import { describe, it, expect } from 'vitest';
import { parseInput, rectangleArea, part1 } from './solution';
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
