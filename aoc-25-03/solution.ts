export type BankArray = string[];
export type Joltage = bigint;

export const findMaxJoltage = (bank: string, numDigitsToSelect: number): Joltage => {
  if (bank.length < numDigitsToSelect) return 0n;
  let result = '', startIdx = 0;
  for (let i = 0; i < numDigitsToSelect; i++) {
    const endIdx = bank.length - (numDigitsToSelect - i);
    let bestDigit = -1, bestDigitIdx = -1;
    for (let j = startIdx; j <= endIdx; j++) {
      const digit = parseInt(bank[j]);
      if (digit > bestDigit) { bestDigit = digit; bestDigitIdx = j; }
    }
    result += bestDigit.toString();
    startIdx = bestDigitIdx + 1;
  }
  return BigInt(result);
};

export const calculateTotal = (banks: BankArray, numDigits: number): Joltage =>
  banks.reduce((sum, bank) => sum + findMaxJoltage(bank, numDigits), 0n);
