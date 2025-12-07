import * as fs from 'fs';
import { parseInput, parseProblemsPart1, parseProblemsPart2, solveWorksheet } from './solution.ts';

const main = (): void => {
  const totalStart = performance.now();
  const readStart = performance.now();
  const input = fs.readFileSync('input.txt', 'utf-8');
  const readTime = performance.now() - readStart;

  const executeStart = performance.now();
  const parsed = parseInput(input);
  const result1 = solveWorksheet(parseProblemsPart1(parsed));
  const result2 = solveWorksheet(parseProblemsPart2(parsed));
  const executeTime = performance.now() - executeStart;

  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
};

main();
