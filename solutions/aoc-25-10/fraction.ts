/**
 * Exact rational arithmetic to avoid floating point errors.
 * Fractions are stored as [numerator, denominator] tuples in lowest terms.
 */

import type { Fraction } from './types';

/** Greatest common divisor using Euclidean algorithm */
const gcd = (a: number, b: number): number => 
  b === 0 ? Math.abs(a) : gcd(b, a % b);

/** Create a fraction in lowest terms with positive denominator */
export const fraction = (numerator: number, denominator: number = 1): Fraction => {
  if (denominator === 0) throw new Error('Division by zero');
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return [sign * numerator / divisor, sign * denominator / divisor];
};

/** Zero as a fraction */
export const ZERO: Fraction = [0, 1];

/** One as a fraction */
export const ONE: Fraction = [1, 1];

/** Check if fraction equals zero */
export const isZero = (f: Fraction): boolean => f[0] === 0;

/** Convert fraction to number */
export const toNumber = (f: Fraction): number => f[0] / f[1];

/** Add two fractions */
export const add = (a: Fraction, b: Fraction): Fraction =>
  fraction(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);

/** Subtract two fractions: a - b */
export const subtract = (a: Fraction, b: Fraction): Fraction =>
  fraction(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);

/** Multiply two fractions */
export const multiply = (a: Fraction, b: Fraction): Fraction =>
  fraction(a[0] * b[0], a[1] * b[1]);

/** Divide two fractions: a / b */
export const divide = (a: Fraction, b: Fraction): Fraction =>
  fraction(a[0] * b[1], a[1] * b[0]);
