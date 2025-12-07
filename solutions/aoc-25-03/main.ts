import * as fs from 'fs';
import { calculateTotal } from './solution';

const readInput = (filePath: string): string[] =>
  fs.readFileSync(filePath, 'utf-8').split('\n').filter(line => line.trim() !== '');

const main = (): void => {
  const banks = readInput('input.txt');
  console.log('Part 1:', calculateTotal(banks, 2).toString());
  console.log('Part 2:', calculateTotal(banks, 12).toString());
};

main();
