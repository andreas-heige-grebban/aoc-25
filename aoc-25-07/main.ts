import * as fs from 'fs';
import { parseInput, simulate } from './solution';
import { timed, printTiming } from '../utils';

const main = (): void => {
  const totalStart = performance.now();
  const { result: input, time: readTime } = timed(() => fs.readFileSync('input.txt', 'utf-8'));
  const { result: { splits, timelines }, time: executeTime } = timed(() => simulate(parseInput(input)));

  console.log('Part 1:', splits);
  console.log('Part 2:', timelines);
  printTiming(readTime, executeTime, performance.now() - totalStart);
};

main();
