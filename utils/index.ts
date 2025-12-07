/** Wrap a function to measure its execution time in milliseconds */
export const timed = <T>(fn: () => T): { result: T; time: number } => {
  const start = performance.now();
  return { result: fn(), time: performance.now() - start };
};

/** Format time in seconds with 6 decimal places */
export const formatTime = (ms: number): string => (ms / 1000).toFixed(6);

/** Print timing results */
export const printTiming = (readTime: number, executeTime: number, totalTime: number): void => {
  console.log(`\nFile Read: ${formatTime(readTime)}s`);
  console.log(`Execution: ${formatTime(executeTime)}s`);
  console.log(`Total: ${formatTime(totalTime)}s`);
};

//  Array Utilities 

/** Sum an array of numbers */
export const sum = (nums: number[]): number => nums.reduce((a, b) => a + b, 0);

/** Multiply an array of numbers */
export const product = (nums: number[]): number => nums.reduce((a, b) => a * b, 1);

/** Sum values from a Map */
export const sumMapValues = <K>(map: Map<K, number>): number => sum([...map.values()]);

//  Parsing Utilities 

/** Split input into non-empty lines */
export const parseLines = (input: string): string[] => 
  input.split('\n').filter(line => line.length > 0);

/** Split input by double newline (for section-based inputs) */
export const parseSections = (input: string): string[] => 
  input.trim().split('\n\n');
