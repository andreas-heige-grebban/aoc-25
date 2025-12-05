// Type definitions
type BankArray = string[];
type Joltage = bigint;

// Read and parse the input file
const readInput = (filePath: string): BankArray => {
  const fs = eval("require('fs')");
  const content = fs.readFileSync(filePath, "utf-8");
  return content.split("\n").filter((line: string) => line.trim() !== "");
};

// Find the maximum joltage by selecting a specified number of positions
const findMaxJoltage = (bank: string, numDigitsToSelect: number): Joltage => {
  if (bank.length < numDigitsToSelect) {
    return 0n;
  }

  let result = "";
  let startIdx = 0;

  for (let i = 0; i < numDigitsToSelect; i++) {
    // Determine the window to search for the current best digit
    const endIdx = bank.length - (numDigitsToSelect - i);
    
    let bestDigit = -1;
    let bestDigitIdx = -1;

    // Find the largest digit in the current window
    for (let j = startIdx; j <= endIdx; j++) {
      const digit = parseInt(bank[j]);
      if (digit > bestDigit) {
        bestDigit = digit;
        bestDigitIdx = j;
      }
    }
    
    result += bestDigit.toString();
    startIdx = bestDigitIdx + 1;
  }
  
  return BigInt(result);
};

// Main function: process all battery banks and sum their maximum joltages
const main = (): void => {
  const banks: BankArray = readInput("input.txt");

  const calculateAndPrintTotal = (numDigits: number): void => {
    const total: Joltage = banks.reduce((sum: Joltage, bank: string) => sum + findMaxJoltage(bank, numDigits), 0n);
    console.log(`Total Joltage (${numDigits} digits):`, total.toString());
  };

  calculateAndPrintTotal(2);  // Part 1
  calculateAndPrintTotal(12); // Part 2
};

main();
