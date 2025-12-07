export type TimedResult<T> = { result: T; time: number };
export type Milliseconds = number;
export type Seconds = string;
export type NumArray = number[];
export type Line = string;
export type Lines = Line[];
export type Section = string;
export type Sections = Section[];

//  Timing Utilities 

/** Wrap a function to measure its execution time in milliseconds */
export const timed = <T>(fn: () => T): TimedResult<T> => {
  const start = performance.now();
  return { result: fn(), time: performance.now() - start };
};

/** Format time in seconds with 6 decimal places */
export const formatTime = (ms: Milliseconds): Seconds => (ms / 1000).toFixed(6);

/** Print timing results */
export const printTiming = (readTime: Milliseconds, executeTime: Milliseconds, totalTime: Milliseconds): void => {
  console.log(`\nFile Read: ${formatTime(readTime)}s`);
  console.log(`Execution: ${formatTime(executeTime)}s`);
  console.log(`Total: ${formatTime(totalTime)}s`);
};

//  Array Utilities 

/** Sum an array of numbers */
export const sum = (nums: NumArray): number => nums.reduce((a, b) => a + b, 0);

/** Multiply an array of numbers */
export const product = (nums: NumArray): number => nums.reduce((a, b) => a * b, 1);

/** Sum values from a Map (accepts ReadonlyMap) */
export const sumMapValues = <K>(map: ReadonlyMap<K, number>): number => sum([...map.values()]);

//  Parsing Utilities 

/** Split input into non-empty lines */
export const parseLines = (input: string): Lines => 
  input.split('\n').filter((line): line is Line => line.length > 0);

/** Split input by double newline (for section-based inputs) */
export const parseSections = (input: string): Sections => 
  input.trim().split('\n\n');
