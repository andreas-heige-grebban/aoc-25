import { readFileSync } from 'fs';
import { parseInput, part1 } from './solution';
import { timed, formatTime } from '../../utils';

const input = readFileSync(new URL('input.txt', import.meta.url), 'utf-8');
const machines = parseInput(input);

console.log('Day 10: Factory');
console.log('================');

const { result: answer1, time: time1 } = timed(() => part1(machines));

console.log(`Part 1: ${answer1} (${formatTime(time1)}s)`);
