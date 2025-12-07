import { describe, it, expect } from 'vitest';
import { parseInput, getNewBeamCols, processRow, simulate } from './solution';

const t = <T extends unknown[]>(cases: T[], fn: (...args: T) => void) => 
  cases.forEach(c => it(c[0] as string, () => fn(...c)));

describe('parseInput', () => t([
  ['simple manifold', '..S..\n.....\n..^..', 2, 5, 3],
  ['varying line lengths', 'S\n...\n.....', 0, 5, 3],
  ['filters empty lines', '..S..\n\n.....', 2, 5, 2],
], (_, input, startCol, width, len) => {
  const r = parseInput(input as string);
  expect([r.startCol, r.width, r.grid.length]).toEqual([startCol, width, len]);
}));

describe('getNewBeamCols', () => t([
  ['splits on ^', 2, '..^..', [1, 3]],
  ['continues on .', 2, '.....', [2]],
  ['continues on space', 2, '  .  ', [2]],
  ['stops on other chars', 2, '..#..', []],
  ['no left at edge', 0, '^....', [1]],
  ['no right at edge', 4, '....^', [3]],
], (_, col, line, exp) => expect(getNewBeamCols(col as number, line as string, 5)).toEqual(exp)));

describe('processRow', () => t([
  ['tracks splits', [[2, 1]], '..^..', 1, [[1, 1], [3, 1]]],
  ['merges timelines', [[1, 1], [3, 1]], '.^.^.', 2, [[0, 1], [2, 2], [4, 1]]],
  ['passes through', [[2, 5]], '.....', 0, [[2, 5]]],
], (_, beams, line, splits, exp) => {
  const r = processRow(new Map(beams as [number, number][]), line as string, 5);
  expect(r.splitPositions).toBe(splits);
  (exp as [number, number][]).forEach(([c, n]) => expect(r.beams.get(c)).toBe(n));
}));

describe('simulate', () => t([
  ['simple split', '..S..\n.....\n..^..\n.....', 1, 2],
  ['multiple levels', '..S..\n.....\n..^..\n.....\n.^.^.', 3, 4],
  ['walls dont stop', '..S..\n.....\n..^..\n#...#\n.....', 1, 2],
  ['edge split', 'S..\n^..\n...', 1, 1],
], (_, input, splits, timelines) => 
  expect(simulate(parseInput(input as string))).toEqual({ splits, timelines })));
