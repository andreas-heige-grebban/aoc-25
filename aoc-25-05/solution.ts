import { sum } from '../utils';

export type Range = [number, number];

export const parseRanges = (input: string): Range[] =>
  input.trim().split('\n\n')[0].split('\n').map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start, end] as Range;
  });

export const parseIds = (input: string): number[] =>
  input.trim().split('\n\n')[1].split('\n').map(Number);

export const isInRange = (id: number, ranges: Range[]): boolean =>
  ranges.some(([start, end]) => id >= start && id <= end);

export const mergeRanges = (ranges: Range[]): Range[] =>
  [...ranges]
    .sort((a, b) => a[0] - b[0])
    .reduce((merged: Range[], [start, end]) => {
      const last = merged[merged.length - 1];
      if (!last || last[1] < start - 1) merged.push([start, end]);
      else last[1] = Math.max(last[1], end);
      return merged;
    }, []);

export const countFreshAvailable = (ids: number[], ranges: Range[]): number =>
  ids.filter(id => isInRange(id, ranges)).length;

export const countAllFresh = (ranges: Range[]): number =>
  sum(mergeRanges(ranges).map(([start, end]) => end - start + 1));
