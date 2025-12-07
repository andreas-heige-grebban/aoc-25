import * as fs from 'fs';
import { parseRanges, parseIds, countFreshAvailable, countAllFresh } from './solution';
import { timed, printTiming } from '../utils';

const main = (): void => {
  const totalStart = performance.now();
  const { result: input, time: readTime } = timed(() => fs.readFileSync('input.txt', 'utf-8'));
  const { time: executeTime } = timed(() => {
    const ranges = parseRanges(input);
    const ids = parseIds(input);
    console.log('Part 1:', countFreshAvailable(ids, ranges));
    console.log('Part 2:', countAllFresh(ranges));
  });
  printTiming(readTime, executeTime, performance.now() - totalStart);
};

main();
