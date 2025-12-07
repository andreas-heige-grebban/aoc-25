import * as fs from 'fs';
import { parseRanges, parseIds, countFreshAvailable, countAllFresh } from './solution.ts';

const main = (): void => {
  const totalStart = performance.now();
  const readStart = performance.now();
  const input = fs.readFileSync('input.txt', 'utf-8');
  const readTime = performance.now() - readStart;

  const executeStart = performance.now();
  const ranges = parseRanges(input);
  const ids = parseIds(input);
  const part1 = countFreshAvailable(ids, ranges);
  const part2 = countAllFresh(ranges);
  const executeTime = performance.now() - executeStart;

  console.log('Part 1:', part1);
  console.log('Part 2:', part2);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
};

main();
