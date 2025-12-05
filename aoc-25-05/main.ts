import * as fs from 'fs';

type Range = [number, number];

type ParsedInput = {
  freshRanges: Range[];
  availableIds: number[];
}

const parseInput = (input: string): ParsedInput => {
  const [rangesSection, idsSection] = input.trim().split('\n\n');
  
  const freshRanges: Range[] = [];
  for (const line of rangesSection.split('\n')) {
    const [start, end] = line.split('-').map(Number);
    freshRanges.push([start, end]);
  }
  
  const availableIds: number[] = [];
  for (const line of idsSection.split('\n')) {
    availableIds.push(Number(line));
  }
  
  return { freshRanges, availableIds };
}

const isFresh = (id: number, freshRanges: Range[]): boolean => {
  for (const [start, end] of freshRanges) {
    if (id >= start && id <= end) {
      return true;
    }
  }
  return false;
}

const countFreshIngredients = ({ freshRanges, availableIds }: ParsedInput): number => {
  let count: number = 0;
  for (const id of availableIds) {
    if (isFresh(id, freshRanges)) {
      count++;
    }
  }
  return count;
}

const output = (): void => {
  const totalStart: number = performance.now();
  
  const readStart: number = performance.now();
  const input: string = fs.readFileSync('input.txt', 'utf-8');
  const readTime: number = performance.now() - readStart;
  
  const executeStart: number = performance.now();
  const { freshRanges, availableIds }: ParsedInput = parseInput(input);
  const result: number = countFreshIngredients({ freshRanges, availableIds });
  const executeTime: number = performance.now() - executeStart;
  
  console.log('Part 1 Fresh ingredients:', result);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
}

output();
