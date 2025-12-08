import { describe, it, expect } from 'vitest';
import { parseInput, distance, generatePairs, createUnionFind, find, union, getCircuitSizes, solve } from './solution';
import { example } from './fixtures';
import type { Point } from './types';

describe('parseInput', () => {
  it('parses coordinates', () => expect(parseInput('1,2,3\n4,5,6')).toEqual([{ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }]));
  it('parses example', () => expect(parseInput(example)).toHaveLength(20));
});

describe('distance', () => {
  const p = (x: number, y: number, z: number): Point => ({ x, y, z });
  it.each([
    ['same point', p(0, 0, 0), p(0, 0, 0), 0],
    ['unit x', p(0, 0, 0), p(1, 0, 0), 1],
    ['unit diagonal', p(0, 0, 0), p(1, 1, 1), Math.sqrt(3)],
  ])('%s', (_, a, b, exp) => expect(distance(a, b)).toBeCloseTo(exp));
});

describe('generatePairs', () => {
  it('generates sorted pairs', () => {
    const pairs = generatePairs([{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 10, y: 0, z: 0 }]);
    expect(pairs).toHaveLength(3);
    expect(pairs[0]).toEqual({ i: 0, j: 1, distance: 1 });
  });
});

describe('Union-Find', () => {
  it('creates with each element as own root', () => {
    const uf = createUnionFind(3);
    [0, 1, 2].forEach(i => expect(find(uf, i)).toBe(i));
  });
  it('union joins two sets', () => {
    const uf = createUnionFind(3);
    expect(union(uf, 0, 1)).toBe(true);
    expect(find(uf, 0)).toBe(find(uf, 1));
  });
  it('union returns false if same set', () => {
    const uf = createUnionFind(3);
    union(uf, 0, 1);
    expect(union(uf, 0, 1)).toBe(false);
  });
});

describe('getCircuitSizes', () => {
  it('returns sorted sizes', () => {
    const uf = createUnionFind(5);
    union(uf, 0, 1);
    union(uf, 0, 2);
    expect(getCircuitSizes(uf)).toEqual([3, 1, 1]);
  });
});

describe('solve', () => {
  it('example with 10 connections', () => expect(solve(example, 10)).toBe(40));
});
