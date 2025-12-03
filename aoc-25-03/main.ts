// Type definitions
type BankArray = string[];
type Joltage = number;

// Read and parse the input file
const readInput = (filePath: string): BankArray => {
  const fs = eval("require('fs')");
  const content = fs.readFileSync(filePath, "utf-8");
  return content.split("\n").filter((line: string) => line.trim() !== "");
};

// Find the maximum joltage by selecting any two positions and forming the largest number
const findMaxJoltage = (bank: string): Joltage => {
  let maxJoltage = 0;
  
  // Try all pairs of positions (i, j) where i < j
  for (let i = 0; i < bank.length; i++) {
    for (let j = i + 1; j < bank.length; j++) {
      const digit1 = parseInt(bank[i]);
      const digit2 = parseInt(bank[j]);
      
      // Form a number: digit at i is tens, digit at j is ones
      const joltage = digit1 * 10 + digit2;
      maxJoltage = Math.max(maxJoltage, joltage);
    }
  }
  
  return maxJoltage;
};

// Main function: process all battery banks and sum their maximum joltages
const main = (): void => {
  const banks: BankArray = readInput("input.txt");
  let totalJoltage: Joltage = 0;

  for (const bank of banks) {
    totalJoltage += findMaxJoltage(bank);
  }

  console.log(totalJoltage);
};

main();
