import { readFileSync } from 'fs';
import { part1, part2 } from './solution';
import { timed, printTiming } from '../../utils';

const { result: input, time: readTime } = timed(() =>
  readFileSync(new URL('./input.txt', import.meta.url), 'utf-8')
);

const { result: result1, time: time1 } = timed(() => part1(input));
const { result: result2, time: time2 } = timed(() => part2(input));

console.log('Part 1:', result1);
console.log('Part 2:', result2);

printTiming(readTime, time1 + time2, readTime + time1 + time2);
