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

const countAllFreshIds = (freshRanges: Range[]): number => {
  // Merge overlapping ranges first, then sum their sizes
  const sorted: Range[] = [...freshRanges].sort((a, b) => a[0] - b[0]);
  const merged: Range[] = [];
  
  for (const [start, end] of sorted) {
    if (merged.length === 0 || merged[merged.length - 1][1] < start - 1) {
      // No overlap, add new range
      merged.push([start, end]);
    } else {
      // Overlap, merge ranges
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
    }
  }
  
  // Sum up the sizes of all merged ranges
  let total: number = 0;
  for (const [start, end] of merged) {
    total += end - start + 1;
  }
  
  return total;
}

const output = (): void => {
  const totalStart: number = performance.now();
  
  const readStart: number = performance.now();
  const input: string = fs.readFileSync('input.txt', 'utf-8');
  const readTime: number = performance.now() - readStart;
  
  const executeStart: number = performance.now();
  const { freshRanges, availableIds }: ParsedInput = parseInput(input);
  const result: number = countFreshIngredients({ freshRanges, availableIds });
  const result2: number = countAllFreshIds(freshRanges);
  const executeTime: number = performance.now() - executeStart;
  
  console.log('Part 1 Fresh ingredients:', result);
  console.log('Part 2 Total fresh IDs:', result2);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
}

output();
