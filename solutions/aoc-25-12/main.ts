import { readFileSync } from 'fs';
import { parseInput, part1, part2 } from './solution';
import { timed, formatTime } from '../../utils';
import type { RawInput } from './types';

const input = readFileSync(new URL('input.txt', import.meta.url), 'utf-8') as RawInput;
const parsed = parseInput(input);

console.log('Day 12: Christmas Tree Farm');
console.log('============================');

const { result: answer1, time: time1 } = timed(() => part1(parsed));
console.log(`Part 1: ${answer1} (${formatTime(time1)}s)`);

const { result: answer2, time: time2 } = timed(() => part2(parsed));
console.log(`Part 2: ${answer2} (${formatTime(time2)}s)`);
