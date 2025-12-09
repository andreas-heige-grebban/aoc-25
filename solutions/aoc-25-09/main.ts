import { readFileSync } from 'fs';
import { part1 } from './solution';

const input = readFileSync(new URL('input.txt', import.meta.url), 'utf-8').trim();

console.log('Part 1:', part1(input));
