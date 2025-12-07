import { describe, it, expect } from 'vitest';
import { parseRanges, parseIds, isInRange, mergeRanges, countFreshAvailable, countAllFresh } from './solution';

const t = <T extends unknown[]>(cases: T[], fn: (...args: T) => void) =>
  cases.forEach(c => it(c[0] as string, () => fn(...c)));

describe('parseRanges', () => t([
  ['single range', '1-5\n\n10', [[1, 5]]],
  ['multiple ranges', '1-5\n10-20\n\n10', [[1, 5], [10, 20]]],
], (_, input, exp) => expect(parseRanges(input as string)).toEqual(exp)));

describe('parseIds', () => t([
  ['single id', '1-5\n\n10', [10]],
  ['multiple ids', '1-5\n\n10\n20\n30', [10, 20, 30]],
], (_, input, exp) => expect(parseIds(input as string)).toEqual(exp)));

describe('isInRange', () => t([
  ['in range', 3, [[1, 5]], true],
  ['out of range', 7, [[1, 5]], false],
  ['on boundary', 5, [[1, 5]], true],
  ['multiple ranges', 15, [[1, 5], [10, 20]], true],
], (_, id, ranges, exp) => expect(isInRange(id as number, ranges as [number, number][])).toBe(exp)));

describe('mergeRanges', () => t([
  ['no overlap', [[1, 5], [10, 15]], [[1, 5], [10, 15]]],
  ['overlap', [[1, 10], [5, 15]], [[1, 15]]],
  ['adjacent', [[1, 5], [6, 10]], [[1, 10]]],
  ['contained', [[1, 20], [5, 10]], [[1, 20]]],
], (_, ranges, exp) => expect(mergeRanges(ranges as [number, number][])).toEqual(exp)));

describe('countFreshAvailable', () => t([
  ['some fresh', [3, 7, 12], [[1, 5], [10, 15]], 2],
  ['none fresh', [6, 7, 8], [[1, 5]], 0],
], (_, ids, ranges, exp) => expect(countFreshAvailable(ids as number[], ranges as [number, number][])).toBe(exp)));

describe('countAllFresh', () => t([
  ['single range', [[1, 5]], 5],
  ['overlapping', [[1, 10], [5, 15]], 15],
  ['gap', [[1, 5], [10, 15]], 11],
], (_, ranges, exp) => expect(countAllFresh(ranges as [number, number][])).toBe(exp)));
