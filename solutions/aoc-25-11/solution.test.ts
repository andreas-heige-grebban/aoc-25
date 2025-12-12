import { describe, it, expect } from 'vitest';
import { parseInput, parseLine, countPaths, part1 } from './solution';
import type { DeviceName, RawInput } from './types';
import { readFileSync } from 'fs';

const exampleInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out` as RawInput;

describe('Day 11: Reactor', () => {
  describe('parseLine', () => {
    it('should parse a line with multiple outputs', () => {
      const [device, outputs] = parseLine('you: bbb ccc');
      expect(device).toBe('you');
      expect(outputs).toEqual(['bbb', 'ccc']);
    });

    it('should parse a line with single output', () => {
      const [device, outputs] = parseLine('eee: out');
      expect(device).toBe('eee');
      expect(outputs).toEqual(['out']);
    });
  });

  describe('parseInput', () => {
    it('should build correct graph from example', () => {
      const graph = parseInput(exampleInput);
      expect(graph.get('you' as DeviceName)).toEqual(['bbb', 'ccc']);
      expect(graph.get('bbb' as DeviceName)).toEqual(['ddd', 'eee']);
      expect(graph.get('eee' as DeviceName)).toEqual(['out']);
    });
  });

  describe('countPaths', () => {
    it('should count paths in example - expect 5', () => {
      const graph = parseInput(exampleInput);
      expect(countPaths(graph)).toBe(5);
    });

    it('should return 1 for direct path to out', () => {
      const graph = parseInput('you: out' as RawInput);
      expect(countPaths(graph)).toBe(1);
    });

    it('should return 2 for two parallel paths', () => {
      const graph = parseInput(`you: a b
a: out
b: out` as RawInput);
      expect(countPaths(graph)).toBe(2);
    });
  });

  describe('part1', () => {
    it('should solve example - expect 5', () => {
      const graph = parseInput(exampleInput);
      expect(part1(graph)).toBe(5);
    });
  });

  describe('part1 with real input', () => {
    it('should solve puzzle input', () => {
      const input = readFileSync('./solutions/aoc-25-11/input.txt', 'utf8') as RawInput;
      const graph = parseInput(input);
      const result = part1(graph);
      console.log('Part 1 answer:', result);
      expect(result).toBeGreaterThan(0);
    });
  });
});
