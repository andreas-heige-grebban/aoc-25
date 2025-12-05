import * as fs from 'fs';

type Range = [number, number];

const parseRanges = (input: string): Range[] =>
  input.trim().split('\n\n')[0].split('\n').map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start, end] as Range;
  });

const parseIds = (input: string): number[] =>
  input.trim().split('\n\n')[1].split('\n').map(Number);

const isInRange = (id: number, ranges: Range[]): boolean =>
  ranges.some(([start, end]) => id >= start && id <= end);

const mergeRanges = (ranges: Range[]): Range[] =>
  [...ranges]
    .sort((a, b) => a[0] - b[0])
    .reduce((merged: Range[], [start, end]) => {
      const last = merged[merged.length - 1];
      if (!last || last[1] < start - 1) {
        merged.push([start, end]);
      } else {
        last[1] = Math.max(last[1], end);
      }
      return merged;
    }, []);

const countFreshAvailable = (ids: number[], ranges: Range[]): number =>
  ids.filter(id => isInRange(id, ranges)).length;

const countAllFresh = (ranges: Range[]): number =>
  mergeRanges(ranges).reduce((sum, [start, end]) => sum + end - start + 1, 0);

const main = (): void => {
  const totalStart: number = performance.now();

  const readStart: number = performance.now();
  const input: string = fs.readFileSync('input.txt', 'utf-8');
  const readTime: number = performance.now() - readStart;

  const executeStart: number = performance.now();
  const ranges: Range[] = parseRanges(input);
  const ids: number[] = parseIds(input);
  const part1: number = countFreshAvailable(ids, ranges);
  const part2: number = countAllFresh(ranges);
  const executeTime: number = performance.now() - executeStart;

  console.log('Part 1:', part1);
  console.log('Part 2:', part2);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
}

main();
