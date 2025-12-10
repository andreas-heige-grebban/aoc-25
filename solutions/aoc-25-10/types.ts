/** Index of an indicator light / counter (0-based) */
export type LightIndex = number & { readonly __brand: 'LightIndex' };
export const lightIndex = (n: number): LightIndex => n as LightIndex;

/** Index of a button (0-based) */
export type ButtonIndex = number & { readonly __brand: 'ButtonIndex' };
export const buttonIndex = (n: number): ButtonIndex => n as ButtonIndex;

/** Number of button presses */
export type PressCount = number & { readonly __brand: 'PressCount' };
export const pressCount = (n: number): PressCount => n as PressCount;

/** Raw input string */
export type RawInput = string;

/** A single line from the input */
export type InputLine = string;

/** Diagram string like [.##.] or {3,5,4,7} */
export type DiagramString = string;

/** Target state for indicator lights: true = on (#), false = off (.) */
export type TargetPattern = readonly boolean[];

/** A button that toggles/increments specific lights/counters when pressed */
export type Button = readonly LightIndex[];
export const button = (...indices: number[]): Button => indices as LightIndex[];

/** Joltage requirement values for each counter */
export type JoltageRequirements = readonly number[];
export const joltage = (...values: number[]): JoltageRequirements => values;

/** A machine with target pattern, buttons, and joltage requirements */
export interface Machine {
  readonly target: TargetPattern;
  readonly buttons: readonly Button[];
  readonly joltage: JoltageRequirements;
}

/** Parsed puzzle input - array of machines */
export type PuzzleInput = readonly Machine[];

/** A fraction represented as [numerator, denominator] for exact arithmetic */
export type Fraction = readonly [numerator: number, denominator: number];

/** Augmented matrix row: coefficients + constant term */
export type MatrixRow = Fraction[];

/** Column index for a variable in the matrix */
export type ColumnIndex = number;

/** Row index in the matrix */
export type RowIndex = number;

/** Solution vector: number of presses per button */
export type Solution = number[];
