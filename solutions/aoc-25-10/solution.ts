import type {
  Machine, PuzzleInput, TargetPattern, Button, PressCount, LightIndex,
  JoltageRequirements, RawInput, InputLine, DiagramString
} from './types';
import { solveLinearSystem } from './linear-solver';

const LIGHT_ON = '#';

/** Parse indicator light diagram [.##.] into boolean array */
export const parseTargetPattern = (diagram: DiagramString): TargetPattern => {
  const withoutBrackets = diagram.slice(1, -1);
  return [...withoutBrackets].map(lightChar => lightChar === LIGHT_ON);
};

/** Parse button schematics from string containing (x,y) (z) patterns */
export const parseButtons = (buttonsStr: InputLine): Button[] =>
  [...buttonsStr.matchAll(/\(([^)]+)\)/g)]
    .map(([, indices]) => indices!.split(',').map(Number) as LightIndex[]);

/** Parse joltage requirements {3,5,4,7} into number array */
export const parseJoltage = (joltageStr: DiagramString): JoltageRequirements =>
  joltageStr.slice(1, -1).split(',').map(Number);

/** Parse a single machine line */
export const parseMachine = (line: InputLine): Machine => {
  const targetMatch = line.match(/\[[.#]+\]/);
  const target = parseTargetPattern(targetMatch![0]!);
  
  // Extract buttons portion (between ] and {)
  const afterBracket = line.indexOf(']') + 1;
  const beforeCurly = line.indexOf('{');
  const buttonsStr = line.slice(afterBracket, beforeCurly);
  const buttons = parseButtons(buttonsStr);
  
  // Extract joltage requirements
  const joltageMatch = line.match(/\{[^}]+\}/);
  const joltage = parseJoltage(joltageMatch![0]!);
  
  return { target, buttons, joltage };
};

/** Parse full puzzle input */
export const parseInput = (input: RawInput): PuzzleInput =>
  input.trim().split('\n').map(parseMachine);

// PART 1: TOGGLE LIGHTS (GF(2) - XOR PROBLEM)

/**
 * Solve for minimum button presses to match target light pattern.
 * 
 * Since pressing a button twice cancels out (XOR/toggle), we work over GF(2).
 * Each button either pressed (1) or not (0). Try all 2^n combinations.
 * 
 * Time: O(2^n * m) where n = buttons, m = lights
 */
export const solveMachine = (machine: Machine): PressCount => {
  const { target, buttons } = machine;
  const numLights = target.length;
  const numButtons = buttons.length;
  
  let minPresses = Infinity;
  
  // Try all 2^numButtons combinations (bitmask enumeration)
  for (let buttonMask = 0; buttonMask < (1 << numButtons); buttonMask++) {
    const lightState = new Array<boolean>(numLights).fill(false);
    let pressCount = 0;
    
    for (let buttonIdx = 0; buttonIdx < numButtons; buttonIdx++) {
      const buttonPressed = (buttonMask & (1 << buttonIdx)) !== 0;
      if (!buttonPressed) continue;
      
      pressCount++;
      // Toggle all lights controlled by this button
      for (const lightIdx of buttons[buttonIdx]!) {
        lightState[lightIdx] = !lightState[lightIdx];
      }
    }
    
    const matchesTarget = lightState.every((light, idx) => light === target[idx]);
    if (matchesTarget) {
      minPresses = Math.min(minPresses, pressCount);
    }
  }
  
  return minPresses as PressCount;
};

/** Part 1: Sum of minimum button presses for all machines */
export const part1 = (machines: PuzzleInput): PressCount =>
  machines.reduce((sum, machine) => sum + solveMachine(machine), 0) as PressCount;

// PART 2: JOLTAGE COUNTERS (INTEGER LINEAR PROGRAMMING)

/**
 * Solve for minimum button presses to reach joltage targets.
 * 
 * Each button press increments counters (additive, not toggle).
 * This is an Integer Linear Programming problem:
 *   minimize: sum(x_i)
 *   subject to: Ax = b, x >= 0, x integer
 * 
 * Solution approach:
 * 1. Gaussian elimination with exact rational arithmetic → RREF
 * 2. Identify pivot (bound) and free variables
 * 3. If unique solution: check non-negativity
 * 4. If free variables: search over free variable space with pruning
 * 
 * Time: O(m*n^2) for RREF + O(maxVal^k) for k free variables
 */
export const solveMachineJoltage = (machine: Machine): PressCount => {
  const { buttons, joltage: targets } = machine;
  const result = solveLinearSystem(buttons, targets);
  return result as PressCount;
};

/** Part 2: Sum of minimum button presses for joltage configuration */
export const part2 = (machines: PuzzleInput): PressCount =>
  machines.reduce((sum, machine) => sum + solveMachineJoltage(machine), 0) as PressCount;
