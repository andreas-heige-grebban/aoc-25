import { sum } from '../../utils';
import type { Range, Ranges, Id, Ids } from './types';

export const parseRanges = (input: string): Ranges =>
  (input.trim().split('\n\n')[0] ?? '').split('\n').map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start ?? 0, end ?? 0] as Range;
  });

export const parseIds = (input: string): Ids =>
  (input.trim().split('\n\n')[1] ?? '').split('\n').map(Number);

export const isInRange = (id: Id, ranges: Ranges): boolean =>
  ranges.some(([start, end]) => id >= start && id <= end);

export const mergeRanges = (ranges: Ranges): Ranges =>
  [...ranges]
    .sort((a, b) => a[0] - b[0])
    .reduce((merged: Ranges, [start, end]) => {
      const last = merged[merged.length - 1];
      if (!last || last[1] < start - 1) merged.push([start, end]);
      else last[1] = Math.max(last[1], end);
      return merged;
    }, []);

export const countFreshAvailable = (ids: Ids, ranges: Ranges): number =>
  ids.filter(id => isInRange(id, ranges)).length;

export const countAllFresh = (ranges: Ranges): number =>
  sum(mergeRanges(ranges).map(([start, end]) => end - start + 1));
