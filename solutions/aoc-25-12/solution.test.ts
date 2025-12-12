import { describe, it, expect } from 'vitest';
import {
  parseInput, parseShape, parseRegion, rotate90,
  getAllVariants, canPlace, canFitAllShapes, part1, normalizeShape
} from './solution';
import type { RawInput, Shape } from './types';
import { readFileSync } from 'fs';

const exampleInput = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2` as RawInput;

describe('Day 12: Christmas Tree Farm', () => {
  describe('parseShape', () => {
    it('should parse shape 4 correctly', () => {
      const shape = parseShape(['###', '#..', '###']);
      expect(shape).toEqual([
        [0, 0], [0, 1], [0, 2],
        [1, 0],
        [2, 0], [2, 1], [2, 2]
      ]);
    });
  });

  describe('parseRegion', () => {
    it('should parse region line', () => {
      const region = parseRegion('12x5: 1 0 1 0 3 2');
      expect(region.width).toBe(12);
      expect(region.height).toBe(5);
      expect(region.quantities).toEqual([1, 0, 1, 0, 3, 2]);
    });

    it('should parse 4x4 region', () => {
      const region = parseRegion('4x4: 0 0 0 0 2 0');
      expect(region.width).toBe(4);
      expect(region.height).toBe(4);
      expect(region.quantities).toEqual([0, 0, 0, 0, 2, 0]);
    });
  });

  describe('parseInput', () => {
    it('should parse example input', () => {
      const input = parseInput(exampleInput);
      expect(input.shapes.length).toBe(6);
      expect(input.regions.length).toBe(3);
    });
  });

  describe('normalizeShape', () => {
    it('should normalize shape to (0,0)', () => {
      const shape: [number, number][] = [[1, 2], [1, 3], [2, 2]];
      const normalized = normalizeShape(shape);
      expect(normalized[0]).toEqual([0, 0]);
    });
  });

  describe('rotate90', () => {
    it('should rotate shape 90 degrees', () => {
      // Simple L shape: ##
      //                 #
      const shape = [[0, 0], [0, 1], [1, 0]] as unknown as Shape;
      const rotated = rotate90(shape);
      // After rotation should be: #
      //                           ##
      expect(rotated.length).toBe(3);
    });
  });

  describe('getAllVariants', () => {
    it('should generate variants for a shape', () => {
      const shape = [[0, 0], [0, 1], [1, 0]] as unknown as Shape;
      const variants = getAllVariants(shape);
      expect(variants.length).toBeGreaterThan(0);
      expect(variants.length).toBeLessThanOrEqual(8);
    });
  });

  describe('canPlace', () => {
    it('should allow valid placement', () => {
      const shape = [[0, 0], [0, 1]] as unknown as Shape;
      const grid = [[false, false], [false, false]];
      expect(canPlace(shape, 0, 0, 2, 2, grid)).toBe(true);
    });

    it('should reject out of bounds', () => {
      const shape = [[0, 0], [0, 1]] as unknown as Shape;
      const grid = [[false, false], [false, false]];
      expect(canPlace(shape, 0, 1, 2, 2, grid)).toBe(false);
    });

    it('should reject overlap', () => {
      const shape = [[0, 0], [0, 1]] as unknown as Shape;
      const grid = [[true, false], [false, false]];
      expect(canPlace(shape, 0, 0, 2, 2, grid)).toBe(false);
    });
  });

  describe('canFitAllShapes', () => {
    it('should fit two shape-4s in 4x4 region', () => {
      const input = parseInput(exampleInput);
      const allVariants = input.shapes.map(getAllVariants);
      const region = input.regions[0]!; // 4x4: 0 0 0 0 2 0
      expect(canFitAllShapes(region, allVariants)).toBe(true);
    });

    it('should fit shapes in second region', () => {
      const input = parseInput(exampleInput);
      const allVariants = input.shapes.map(getAllVariants);
      const region = input.regions[1]!; // 12x5: 1 0 1 0 2 2
      expect(canFitAllShapes(region, allVariants)).toBe(true);
    });

    it('should NOT fit shapes in third region', () => {
      const input = parseInput(exampleInput);
      const allVariants = input.shapes.map(getAllVariants);
      const region = input.regions[2]!; // 12x5: 1 0 1 0 3 2
      expect(canFitAllShapes(region, allVariants)).toBe(false);
    });
  });

  describe('part1', () => {
    it('should solve example - expect 2', () => {
      const input = parseInput(exampleInput);
      expect(part1(input)).toBe(2);
    });
  });

  describe('part1 with real input', () => {
    it('should solve puzzle input', () => {
      const rawInput = readFileSync('./solutions/aoc-25-12/input.txt', 'utf8') as RawInput;
      const input = parseInput(rawInput);
      const result = part1(input);
      console.log('Part 1 answer:', result);
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});
