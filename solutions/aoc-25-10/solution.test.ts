import { describe, it, expect } from 'vitest';
import { parseInput, parseMachine, parseTargetPattern, parseButtons, parseJoltage, solveMachine, solveMachineJoltage, part1, part2 } from './solution';
import { button, pressCount, joltage } from './types';

const t = <T>(name: string, fn: () => T, expected: T) => it(name, () => expect(fn()).toEqual(expected));

const example = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

describe('Day 10: Factory', () => {
  describe('parsing', () => {
    t('parseTargetPattern', () => parseTargetPattern('[.###.#]'), [false, true, true, true, false, true]);
    t('parseButtons', () => parseButtons('(0,2,3,4) (2,3)'), [button(0, 2, 3, 4), button(2, 3)]);
    t('parseJoltage', () => parseJoltage('{3,5,4,7}'), joltage(3, 5, 4, 7));
    t('parseMachine', () => parseMachine('[.##.] (3) (1,3) {3,5}'), { target: [false, true, true, false], buttons: [button(3), button(1, 3)], joltage: joltage(3, 5) });
    t('parseInput', () => parseInput(example).length, 3);
  });

  describe('solveMachine (Part 1 - lights)', () => {
    t('example 1: 2 presses', () => solveMachine(parseMachine('[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}')), pressCount(2));
    t('example 2: 3 presses', () => solveMachine(parseMachine('[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}')), pressCount(3));
    t('example 3: 2 presses', () => solveMachine(parseMachine('[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}')), pressCount(2));
  });

  describe('solveMachineJoltage (Part 2 - counters)', () => {
    t('example 1: 10 presses', () => solveMachineJoltage(parseMachine('[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}')), pressCount(10));
    t('example 2: 12 presses', () => solveMachineJoltage(parseMachine('[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}')), pressCount(12));
    t('example 3: 11 presses', () => solveMachineJoltage(parseMachine('[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}')), pressCount(11));
  });

  describe('part1', () => {
    t('sum of minimum presses = 7', () => part1(parseInput(example)), pressCount(7));
  });

  describe('part2', () => {
    t('sum of minimum joltage presses = 33', () => part2(parseInput(example)), pressCount(33));
  });
});
