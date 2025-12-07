import { describe, it, expect } from 'vitest';
import { timed, formatTime, sum, product, sumMapValues, parseLines, parseSections } from './index';

const t = <I, O>(name: string, fn: (i: I) => O, cases: [I, O][]) =>
  describe(name, () => cases.forEach(([i, o]) => it(`${JSON.stringify(i)} → ${JSON.stringify(o)}`, () => expect(fn(i)).toEqual(o))));

t('sum', sum, [[[1, 2, 3], 6], [[], 0], [[-1, 1], 0], [[10], 10]]);
t('product', product, [[[2, 3, 4], 24], [[], 1], [[5], 5], [[2, -3], -6]]);
t('parseLines', parseLines, [['a\nb\nc', ['a', 'b', 'c']], ['a\n\nb', ['a', 'b']], ['', []]]);
t('parseSections', parseSections, [['a\n\nb', ['a', 'b']], ['a\nb\n\nc\nd', ['a\nb', 'c\nd']]]);
t('formatTime', formatTime, [[1000, '1.000000'], [0, '0.000000'], [1.5, '0.001500']]);
t('sumMapValues', (entries: [string, number][]) => sumMapValues(new Map(entries)), [
  [[['a', 1], ['b', 2]], 3], [[], 0], [[['x', -5], ['y', 5]], 0]
]);

describe('timed', () => {
  it('returns result and time', () => {
    const { result, time } = timed(() => 42);
    expect(result).toBe(42);
    expect(time).toBeGreaterThanOrEqual(0);
  });
});
