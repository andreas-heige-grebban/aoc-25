import * as fs from 'fs';
import type { SimResult, Timed } from './types.ts';
import { parseInput, simulate } from './solution';

/** Wrap a function to measure its execution time in milliseconds */
const timed = <T>(fn: () => T): Timed<T> => {
  const start: number = performance.now();
  return { result: fn(), time: performance.now() - start };
};

/** Main entry point: read input, run simulation, print results with timing */
const main = (): void => {
  const totalStart: number = performance.now();
  
  const { result: input, time: readTime }: Timed<string> = timed((): string => fs.readFileSync('input.txt', 'utf-8'));
  const { result: { splits, timelines }, time: executeTime }: Timed<SimResult> = timed((): SimResult => simulate(parseInput(input)));

  console.log('Part 1:', splits);
  console.log('Part 2:', timelines);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
};

main();
