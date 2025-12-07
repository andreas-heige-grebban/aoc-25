/** Math operator for a problem */
export type Operator = '+' | '*';

/** A math problem with numbers and operator */
export type Problem = { 
  numbers: number[]; 
  operator: Operator;
};

/** Array of problems */
export type Problems = Problem[];

/** Column range [start, end) for a problem in the grid */
export type ProblemRange = [number, number];

/** Parsed worksheet input structure */
export type ParsedInput = {
  lines: string[];
  operatorLine: string;
  numberLines: string[];
  problemRanges: ProblemRange[];
  width: number;
  paddedNumberLines: string[];
};
