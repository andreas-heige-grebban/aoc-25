import type { Machine, PuzzleInput, TargetPattern, Button, PressCount, LightIndex } from './types';


/** Parse indicator light diagram [.##.] into boolean array */
export const parseTargetPattern = (diagram: string): TargetPattern => {
  const withoutBrackets = diagram.slice(1, -1);
  return [...withoutBrackets].map(lightChar => lightChar === '#');
};

/** Parse button schematics from string containing (x,y) (z) patterns */
export const parseButtons = (buttonsStr: string): Button[] =>
  [...buttonsStr.matchAll(/\(([^)]+)\)/g)]
    .map(([, indices]) => indices!.split(',').map(Number) as LightIndex[]);

/** Parse a single machine line */
export const parseMachine = (line: string): Machine => {
  const targetMatch = line.match(/\[[.#]+\]/);
  const target = parseTargetPattern(targetMatch![0]!);
  
  // Extract buttons portion (between ] and {)
  const afterBracket = line.indexOf(']') + 1;
  const beforeCurly = line.indexOf('{');
  const buttonsStr = line.slice(afterBracket, beforeCurly);
  const buttons = parseButtons(buttonsStr);
  
  return { target, buttons };
};

/** Parse full puzzle input */
export const parseInput = (input: string): PuzzleInput =>
  input.trim().split('\n').map(parseMachine);

/**
 * Solve for minimum button presses using brute force over GF(2).
 * Since pressing a button twice cancels out, we only need to try
 * each button 0 or 1 times. Try all 2^n combinations.
 */
export const solveMachine = (machine: Machine): PressCount => {
  const { target, buttons } = machine;
  const numLights = target.length;
  const numButtons = buttons.length;
  
  let minPresses = Infinity;
  
  // Try all 2^numButtons combinations
  for (let mask = 0; mask < (1 << numButtons); mask++) {
    // Simulate this combination of button presses
    const state = new Array(numLights).fill(false);
    let presses = 0;
    
    for (let buttonIndex = 0; buttonIndex < numButtons; buttonIndex++) {
      if (mask & (1 << buttonIndex)) {
        presses++;
        // Toggle all lights this button controls
        for (const lightIndex of buttons[buttonIndex]!) {
          state[lightIndex] = !state[lightIndex];
        }
      }
    }
    
    // Check if state matches target
    const matches = state.every((light, index) => light === target[index]);
    if (matches) {
      minPresses = Math.min(minPresses, presses);
    }
  }
  
  return minPresses as PressCount;
};

/** Part 1: Sum of minimum button presses for all machines */
export const part1 = (machines: PuzzleInput): PressCount =>
  machines.reduce((sum, machine) => sum + solveMachine(machine), 0) as PressCount;
