import { readFileSync } from 'fs';
import { part1 } from './solution';
import { timed, printTiming } from '../../utils';

const { result: input, time: readTime } = timed(() => 
  readFileSync(new URL('./input.txt', import.meta.url), 'utf-8')
);

const { result: result1, time: time1 } = timed(() => part1(input));

console.log('Part 1:', result1);

printTiming(readTime, time1, readTime + time1);
