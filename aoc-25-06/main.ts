import * as fs from 'fs';
import { parseInput, parseProblemsPart1, parseProblemsPart2, solveWorksheet } from './solution';
import { timed, printTiming } from '../utils';

const main = (): void => {
  const totalStart = performance.now();
  const { result: input, time: readTime } = timed(() => fs.readFileSync('input.txt', 'utf-8'));
  const { time: executeTime } = timed(() => {
    const parsed = parseInput(input);
    console.log('Part 1:', solveWorksheet(parseProblemsPart1(parsed)));
    console.log('Part 2:', solveWorksheet(parseProblemsPart2(parsed)));
  });
  printTiming(readTime, executeTime, performance.now() - totalStart);
};

main();
