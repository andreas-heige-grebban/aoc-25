/**
 * Linear algebra solver using Gaussian elimination with exact rational arithmetic.
 * Solves systems of linear equations Ax = b where we want non-negative integer solutions.
 */

import type { 
  MatrixRow, ColumnIndex, RowIndex, Solution,
  LightIndex, Button, JoltageRequirements 
} from './types';
import { fraction, ZERO, ONE, isZero, toNumber, subtract, multiply, divide } from './fraction';

/** Build the augmented matrix [A | b] from buttons and targets */
const buildAugmentedMatrix = (
  buttons: readonly Button[],
  targets: JoltageRequirements
): MatrixRow[] => {
  const numButtons = buttons.length;
  const numCounters = targets.length;
  
  return Array.from({ length: numCounters }, (_, counterIdx) => {
    const row: MatrixRow = Array.from({ length: numButtons + 1 }, (_, buttonIdx) => {
      if (buttonIdx === numButtons) {
        return fraction(targets[counterIdx]!);
      }
      const buttonAffectsCounter = buttons[buttonIdx]!.includes(counterIdx as LightIndex);
      return buttonAffectsCounter ? ONE : ZERO;
    });
    return row;
  });
};

/** 
 * Perform Gaussian elimination to Reduced Row Echelon Form (RREF).
 * Returns the pivot columns (bound variables).
 */
const toReducedRowEchelonForm = (matrix: MatrixRow[]): ColumnIndex[] => {
  const numRows = matrix.length;
  const numCols = matrix[0]!.length - 1; // Exclude augmented column
  const pivotColumns: ColumnIndex[] = [];
  let currentPivotRow: RowIndex = 0;
  
  for (let col = 0; col < numCols && currentPivotRow < numRows; col++) {
    // Find row with non-zero entry in this column
    const pivotRowIdx = findPivotRow(matrix, col, currentPivotRow);
    if (pivotRowIdx === -1) continue;
    
    // Swap rows if needed
    swapRows(matrix, currentPivotRow, pivotRowIdx);
    pivotColumns.push(col);
    
    // Normalize pivot row (make leading coefficient = 1)
    normalizePivotRow(matrix, currentPivotRow, col);
    
    // Eliminate this column in all other rows
    eliminateColumn(matrix, currentPivotRow, col);
    
    currentPivotRow++;
  }
  
  return pivotColumns;
};

/** Find first row at or below startRow with non-zero entry in column */
const findPivotRow = (
  matrix: MatrixRow[], 
  col: ColumnIndex, 
  startRow: RowIndex
): RowIndex => {
  for (let row = startRow; row < matrix.length; row++) {
    if (!isZero(matrix[row]![col]!)) return row;
  }
  return -1;
};

/** Swap two rows in the matrix */
const swapRows = (matrix: MatrixRow[], row1: RowIndex, row2: RowIndex): void => {
  [matrix[row1], matrix[row2]] = [matrix[row2]!, matrix[row1]!];
};

/** Divide pivot row by its leading coefficient to make it 1 */
const normalizePivotRow = (
  matrix: MatrixRow[], 
  pivotRow: RowIndex, 
  pivotCol: ColumnIndex
): void => {
  const pivotValue = matrix[pivotRow]![pivotCol]!;
  const row = matrix[pivotRow]!;
  for (let col = 0; col < row.length; col++) {
    row[col] = divide(row[col]!, pivotValue);
  }
};

/** Eliminate the pivot column in all rows except the pivot row */
const eliminateColumn = (
  matrix: MatrixRow[], 
  pivotRow: RowIndex, 
  pivotCol: ColumnIndex
): void => {
  const pivotRowData = matrix[pivotRow]!;
  
  for (let row = 0; row < matrix.length; row++) {
    if (row === pivotRow) continue;
    
    const factor = matrix[row]![pivotCol]!;
    if (isZero(factor)) continue;
    
    const currentRow = matrix[row]!;
    for (let col = 0; col < currentRow.length; col++) {
      currentRow[col] = subtract(currentRow[col]!, multiply(factor, pivotRowData[col]!));
    }
  }
};

/** Identify free variables (columns not in pivot columns) */
const findFreeVariables = (
  numVariables: number, 
  pivotColumns: ColumnIndex[]
): ColumnIndex[] => {
  const pivotSet = new Set(pivotColumns);
  return Array.from({ length: numVariables }, (_, i) => i)
    .filter(col => !pivotSet.has(col));
};

/** Verify a solution satisfies the original constraints */
const verifySolution = (
  solution: Solution,
  buttons: readonly Button[],
  targets: JoltageRequirements
): boolean => {
  for (let counterIdx = 0; counterIdx < targets.length; counterIdx++) {
    let actualSum = 0;
    for (let buttonIdx = 0; buttonIdx < buttons.length; buttonIdx++) {
      if (buttons[buttonIdx]!.includes(counterIdx as LightIndex)) {
        actualSum += solution[buttonIdx]!;
      }
    }
    if (actualSum !== targets[counterIdx]!) return false;
  }
  return true;
};

/** Compute bound variables from free variable values using back-substitution */
const computeBoundVariables = (
  matrix: MatrixRow[],
  pivotColumns: ColumnIndex[],
  freeVariables: ColumnIndex[],
  freeValues: number[],
  numVariables: number
): Solution | null => {
  const solution: Solution = new Array(numVariables).fill(0);
  
  // Set free variable values
  for (let i = 0; i < freeVariables.length; i++) {
    solution[freeVariables[i]!] = freeValues[i]!;
  }
  
  // Back-substitute to compute bound variables
  for (let i = pivotColumns.length - 1; i >= 0; i--) {
    const boundCol = pivotColumns[i]!;
    let value = toNumber(matrix[i]![numVariables]!); // Constant term
    
    // Subtract contributions from variables to the right
    for (let col = boundCol + 1; col < numVariables; col++) {
      value -= toNumber(matrix[i]![col]!) * solution[col]!;
    }
    
    // Check if result is an integer
    const rounded = Math.round(value);
    if (Math.abs(value - rounded) > 1e-6) return null;
    
    solution[boundCol] = rounded;
  }
  
  return solution;
};

/** Check if all values in solution are non-negative */
const isNonNegative = (solution: Solution): boolean =>
  solution.every(value => value >= 0);

/** Sum all values in solution */
const sumSolution = (solution: Solution): number =>
  solution.reduce((sum, value) => sum + value, 0);

/**
 * Search over free variable space to find minimum sum solution.
 * Uses depth-first search with pruning.
 */
const searchFreeVariableSpace = (
  matrix: MatrixRow[],
  pivotColumns: ColumnIndex[],
  freeVariables: ColumnIndex[],
  buttons: readonly Button[],
  targets: JoltageRequirements,
  maxValue: number
): number => {
  const numVariables = buttons.length;
  let bestSum = Infinity;
  
  const search = (varIdx: number, freeValues: number[], currentSum: number): void => {
    // Pruning: current sum already exceeds best
    if (currentSum >= bestSum) return;
    
    if (varIdx === freeVariables.length) {
      const solution = computeBoundVariables(
        matrix, pivotColumns, freeVariables, freeValues, numVariables
      );
      
      if (solution && isNonNegative(solution) && verifySolution(solution, buttons, targets)) {
        const totalSum = sumSolution(solution);
        if (totalSum < bestSum) bestSum = totalSum;
      }
      return;
    }
    
    for (let value = 0; value <= maxValue; value++) {
      search(varIdx + 1, [...freeValues, value], currentSum + value);
    }
  };
  
  search(0, [], 0);
  return bestSum;
};

/**
 * Solve the linear system for minimum non-negative integer solution.
 * Returns the sum of all variable values, or 0 if no solution exists.
 */
export const solveLinearSystem = (
  buttons: readonly Button[],
  targets: JoltageRequirements
): number => {
  const numButtons = buttons.length;
  const matrix = buildAugmentedMatrix(buttons, targets);
  const pivotColumns = toReducedRowEchelonForm(matrix);
  const freeVariables = findFreeVariables(numButtons, pivotColumns);
  
  // Unique solution case: no free variables
  if (freeVariables.length === 0) {
    const solution = computeBoundVariables(matrix, pivotColumns, [], [], numButtons);
    if (!solution || !isNonNegative(solution)) return Infinity;
    return sumSolution(solution);
  }
  
  // Multiple solutions: search over free variables
  const maxSearchValue = Math.max(...targets) * 2;
  const result = searchFreeVariableSpace(
    matrix, pivotColumns, freeVariables, buttons, targets, maxSearchValue
  );
  
  return result === Infinity ? 0 : result;
};
