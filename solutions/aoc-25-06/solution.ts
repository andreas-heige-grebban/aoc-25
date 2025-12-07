import { sum, product, parseLines } from '../../utils';
import type { Operator, Problem, Problems, ProblemRange, ParsedInput } from './types';

export const findProblemRanges = (lines: string[], width: number): ProblemRange[] => {
  const paddedLines = lines.map(l => l.padEnd(width));
  const separatorCols: number[] = [];
  for (let col = 0; col < width; col++)
    if (paddedLines.every(line => line[col] === ' ')) separatorCols.push(col);
  const problemRanges: ProblemRange[] = [];
  for (let i = 0; i <= separatorCols.length; i++) {
    const col = separatorCols[i] ?? width, prevCol = separatorCols[i - 1] ?? -1;
    if (col > prevCol + 1 || i === separatorCols.length) {
      const problemStart = prevCol + 1, problemEnd = col;
      if (problemEnd > problemStart) problemRanges.push([problemStart, problemEnd]);
    }
  }
  return problemRanges;
};

export const parseInput = (input: string): ParsedInput => {
  const lines = parseLines(input);
  const operatorLine = lines[lines.length - 1] ?? '', numberLines = lines.slice(0, -1);
  const width = Math.max(...lines.map(l => l.length));
  const problemRanges = findProblemRanges(lines, width);
  const paddedNumberLines = numberLines.map(l => l.padEnd(width));
  return { lines, operatorLine, numberLines, problemRanges, width, paddedNumberLines };
};

export const getOperator = (operatorLine: string, colStart: number, colEnd: number): Operator =>
  operatorLine.slice(colStart, colEnd).trim().includes('*') ? '*' : '+';

export const parseProblemsPart1 = ({ numberLines, operatorLine, problemRanges }: ParsedInput): Problems =>
  problemRanges.map(([colStart, colEnd]) => ({
    numbers: numberLines.map(line => line.slice(colStart, colEnd).trim())
      .filter(s => s.length > 0).map(s => parseInt(s, 10)).filter(n => !isNaN(n)),
    operator: getOperator(operatorLine, colStart, colEnd)
  }));

export const parseProblemsPart2 = ({ paddedNumberLines, operatorLine, problemRanges }: ParsedInput): Problems =>
  problemRanges.map(([colStart, colEnd]) => {
    const numbers: number[] = [];
    for (let col = colStart; col < colEnd; col++) {
      const digitStr = paddedNumberLines.map(line => line[col]).filter((c): c is string => c !== undefined && c >= '0' && c <= '9').join('');
      if (digitStr.length > 0) numbers.push(parseInt(digitStr, 10));
    }
    return { numbers, operator: getOperator(operatorLine, colStart, colEnd) };
  });

export const solveProblem = ({ numbers, operator }: Problem): number =>
  operator === '+' ? sum(numbers) : product(numbers);

export const solveWorksheet = (problems: Problems): number =>
  sum(problems.map(solveProblem));
