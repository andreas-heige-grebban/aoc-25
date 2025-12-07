import { describe, it, expect } from 'vitest';
import { findMaxJoltage, calculateTotal } from './solution';

const t = <T extends unknown[]>(cases: T[], fn: (...args: T) => void) =>
  cases.forEach(c => it(c[0] as string, () => fn(...c)));

describe('findMaxJoltage', () => t([
  ['single digit', '12345', 1, 5n],
  ['two digits', '12345', 2, 45n],
  ['three digits', '12945', 3, 945n],
  ['all same', '11111', 2, 11n],
  ['descending', '54321', 3, 543n],
  ['bank too short', '12', 5, 0n],
], (_, bank, num, exp) => expect(findMaxJoltage(bank as string, num as number)).toBe(exp)));

describe('calculateTotal', () => t([
  ['single bank', ['12345'], 2, 45n],
  ['multiple banks', ['12345', '67890'], 2, 45n + 90n],
  ['twelve digits', ['123456789012'], 12, 123456789012n],
], (_, banks, num, exp) => expect(calculateTotal(banks as string[], num as number)).toBe(exp)));
