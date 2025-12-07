import { describe, it, expect } from 'vitest';
import { parseInput, parseProblemsPart1, parseProblemsPart2, solveProblem, solveWorksheet } from './solution';

const t = <T extends unknown[]>(cases: T[], fn: (...args: T) => void) =>
  cases.forEach(c => it(c[0] as string, () => fn(...c)));

describe('parseInput', () => {
  it('parses simple input', () => {
    const input = '12\n34\n+ ';
    const result = parseInput(input);
    expect(result.numberLines).toEqual(['12', '34']);
    expect(result.operatorLine).toBe('+ ');
  });
});

describe('parseProblemsPart1', () => {
  it('reads numbers horizontally', () => {
    const parsed = parseInput('12 34\n56 78\n+  * ');
    const problems = parseProblemsPart1(parsed);
    expect(problems[0]?.numbers).toEqual([12, 56]);
    expect(problems[0]?.operator).toBe('+');
    expect(problems[1]?.numbers).toEqual([34, 78]);
    expect(problems[1]?.operator).toBe('*');
  });
});

describe('parseProblemsPart2', () => {
  it('reads numbers vertically', () => {
    const parsed = parseInput('12\n34\n+ ');
    const problems = parseProblemsPart2(parsed);
    expect(problems[0]?.numbers).toEqual([13, 24]);
  });
});

describe('solveProblem', () => t([
  ['addition', { numbers: [1, 2, 3], operator: '+' }, 6],
  ['multiplication', { numbers: [2, 3, 4], operator: '*' }, 24],
  ['single number add', { numbers: [5], operator: '+' }, 5],
], (_, problem, exp) => expect(solveProblem(problem as any)).toBe(exp)));

describe('solveWorksheet', () => t([
  ['mixed ops', [{ numbers: [1, 2], operator: '+' }, { numbers: [3, 4], operator: '*' }], 15],
], (_, problems, exp) => expect(solveWorksheet(problems as any)).toBe(exp)));
