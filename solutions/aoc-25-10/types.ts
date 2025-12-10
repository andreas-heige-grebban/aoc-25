/** Index of an indicator light (0-based) */
export type LightIndex = number & { readonly __brand: 'LightIndex' };
export const lightIndex = (n: number): LightIndex => n as LightIndex;

/** Index of a button */
export type ButtonIndex = number & { readonly __brand: 'ButtonIndex' };

/** Target state for indicator lights: true = on (#), false = off (.) */
export type LightState = boolean;
export type TargetPattern = readonly LightState[];

/** A button that toggles specific lights when pressed */
export type Button = readonly LightIndex[];
export const button = (...indices: number[]): Button => indices as LightIndex[];

/** A machine with target pattern and available buttons */
export interface Machine {
  readonly target: TargetPattern;
  readonly buttons: readonly Button[];
}

/** Parsed puzzle input - array of machines */
export type PuzzleInput = readonly Machine[];

/** Number of button presses */
export type PressCount = number & { readonly __brand: 'PressCount' };
export const pressCount = (n: number): PressCount => n as PressCount;
