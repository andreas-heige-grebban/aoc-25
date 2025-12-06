import * as fs from 'fs';

type Operator = '+' | '*';

type Problem = {
  numbers: number[];
  operator: Operator;
}

type ProblemRange = [number, number];

type ParsedInput = {
  lines: string[];
  operatorLine: string;
  numberLines: string[];
  problemRanges: ProblemRange[];
  width: number;
  paddedNumberLines: string[];
}

const findProblemRanges = (lines: string[], width: number): ProblemRange[] => {
  const paddedLines: string[] = lines.map(l => l.padEnd(width));
  
  // Find columns that are spaces in ALL rows
  const separatorCols: number[] = [];
  for (let col = 0; col < width; col++) {
    const isAllSpace: boolean = paddedLines.every(line => line[col] === ' ');
    if (isAllSpace) {
      separatorCols.push(col);
    }
  }
  
  // Group consecutive separator columns and find problem boundaries
  const problemRanges: ProblemRange[] = [];
  
  for (let i = 0; i <= separatorCols.length; i++) {
    const col = separatorCols[i] ?? width;
    const prevCol = separatorCols[i - 1] ?? -1;
    
    if (col > prevCol + 1 || i === separatorCols.length) {
      const problemStart = prevCol + 1;
      const problemEnd = col;
      if (problemEnd > problemStart) {
        problemRanges.push([problemStart, problemEnd]);
      }
    }
  }
  
  return problemRanges;
}

const parseInput = (input: string): ParsedInput => {
  const lines: string[] = input.split('\n').filter(line => line.length > 0);
  const operatorLine: string = lines[lines.length - 1];
  const numberLines: string[] = lines.slice(0, -1);
  const width: number = Math.max(...lines.map(l => l.length));
  const problemRanges: ProblemRange[] = findProblemRanges(lines, width);
  const paddedNumberLines: string[] = numberLines.map(l => l.padEnd(width));
  
  return { lines, operatorLine, numberLines, problemRanges, width, paddedNumberLines };
}

const getOperator = (operatorLine: string, colStart: number, colEnd: number): Operator => {
  const opSegment: string = operatorLine.slice(colStart, colEnd).trim();
  return opSegment.includes('*') ? '*' : '+';
}

// Part 1: Read numbers horizontally (row by row)
const parseProblemsPart1 = ({ numberLines, operatorLine, problemRanges }: ParsedInput): Problem[] =>
  problemRanges.map(([colStart, colEnd]) => {
    const numbers: number[] = numberLines
      .map(line => line.slice(colStart, colEnd).trim())
      .filter(segment => segment.length > 0)
      .map(segment => parseInt(segment, 10))
      .filter(num => !isNaN(num));
    
    return { numbers, operator: getOperator(operatorLine, colStart, colEnd) };
  });

// Part 2: Read numbers vertically (column by column, top-to-bottom = most to least significant)
const parseProblemsPart2 = ({ paddedNumberLines, operatorLine, problemRanges }: ParsedInput): Problem[] =>
  problemRanges.map(([colStart, colEnd]) => {
    const numbers: number[] = [];
    
    // Each column within the problem range is a separate number
    for (let col = colStart; col < colEnd; col++) {
      const digitStr: string = paddedNumberLines
        .map(line => line[col])
        .filter(char => char >= '0' && char <= '9')
        .join('');
      if (digitStr.length > 0) {
        numbers.push(parseInt(digitStr, 10));
      }
    }
    
    return { numbers, operator: getOperator(operatorLine, colStart, colEnd) };
  });

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

const output = (): void => {
  const totalStart: number = performance.now();

  const readStart: number = performance.now();
  const input: string = fs.readFileSync('input.txt', 'utf-8');
  const readTime: number = performance.now() - readStart;

  const executeStart: number = performance.now();
  
  const parsed: ParsedInput = parseInput(input);
  const problemsPart1: Problem[] = parseProblemsPart1(parsed);
  const result1: number = solveWorksheet(problemsPart1);
  
  const problemsPart2: Problem[] = parseProblemsPart2(parsed);
  const result2: number = solveWorksheet(problemsPart2);
  
  const executeTime: number = performance.now() - executeStart;

  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
}

output();
