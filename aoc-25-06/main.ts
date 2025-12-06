import * as fs from 'fs';

type Operator = '+' | '*';

type Problem = {
  numbers: number[];
  operator: Operator;
}

const parseProblems = (input: string): Problem[] => {
  const lines: string[] = input.split('\n').filter(line => line.length > 0);
  const operatorLine: string = lines[lines.length - 1];
  const numberLines: string[] = lines.slice(0, -1);
  
  // Find column boundaries by identifying groups separated by all-space columns
  const width: number = Math.max(...lines.map(l => l.length));
  const paddedLines: string[] = lines.map(l => l.padEnd(width));
  
  // Find columns that are spaces in ALL rows (including operator row)
  const separatorCols: number[] = [];
  for (let col = 0; col < width; col++) {
    const isAllSpace: boolean = paddedLines.every(line => line[col] === ' ');
    if (isAllSpace) {
      separatorCols.push(col);
    }
  }
  
  // Group consecutive separator columns and find problem boundaries
  const problemRanges: [number, number][] = [];
  
  for (let i = 0; i <= separatorCols.length; i++) {
    const col = separatorCols[i] ?? width;
    const prevCol = separatorCols[i - 1] ?? -1;
    
    // If there's a gap (non-separator columns), we have a problem
    if (col > prevCol + 1 || i === separatorCols.length) {
      const problemStart = prevCol + 1;
      const problemEnd = col;
      if (problemEnd > problemStart) {
        problemRanges.push([problemStart, problemEnd]);
      }
    }
  }
  
  // Extract problems from each range
  const problems: Problem[] = problemRanges.map(([colStart, colEnd]) => {
    const numbers: number[] = [];
    
    for (const line of numberLines) {
      const segment: string = line.slice(colStart, colEnd).trim();
      if (segment.length > 0) {
        const num: number = parseInt(segment, 10);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      }
    }
    
    const opSegment: string = operatorLine.slice(colStart, colEnd).trim();
    const operator: Operator = opSegment.includes('*') ? '*' : '+';
    
    return { numbers, operator };
  });
  
  return problems;
}

const solveProblem = (problem: Problem): number => {
  const { numbers, operator } = problem;
  if (operator === '+') {
    return numbers.reduce((sum, n) => sum + n, 0);
  } else {
    return numbers.reduce((prod, n) => prod * n, 1);
  }
}

const solveWorksheet = (problems: Problem[]): number =>
  problems.reduce((total, problem) => total + solveProblem(problem), 0);

const main = (): void => {
  const totalStart: number = performance.now();

  const readStart: number = performance.now();
  const input: string = fs.readFileSync('input.txt', 'utf-8');
  const readTime: number = performance.now() - readStart;

  const executeStart: number = performance.now();
  const problems: Problem[] = parseProblems(input);
  const result: number = solveWorksheet(problems);
  const executeTime: number = performance.now() - executeStart;

  console.log('Part 1:', result);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
}

main();
