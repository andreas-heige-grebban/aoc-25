import type { DeviceGraph, DeviceName, RawInput, InputLine } from './types';
import { START_DEVICE, END_DEVICE } from './types';

/**
 * Parse a single line "device: output1 output2 ..." into [device, outputs]
 */
export const parseLine = (line: InputLine): [DeviceName, DeviceName[]] => {
  const [device, outputsStr] = line.split(': ');
  const outputs = outputsStr ? outputsStr.split(' ').map(s => s as DeviceName) : [];
  return [device as DeviceName, outputs];
};

/**
 * Parse the full input into a graph representation
 */
export const parseInput = (input: RawInput): DeviceGraph => {
  const graph: DeviceGraph = new Map();
  
  for (const line of input.trim().split('\n')) {
    const [device, outputs] = parseLine(line);
    graph.set(device, outputs);
  }
  
  return graph;
};

/**
 * Count all paths from 'you' to 'out' using DFS with memoization.
 * 
 * Uses dynamic programming: pathCount(node) = sum of pathCount(each output)
 * Base case: pathCount('out') = 1
 * 
 * Memoization is crucial since multiple devices can lead to the same device,
 * creating overlapping subproblems.
 */
export const countPaths = (
  graph: DeviceGraph,
  from: DeviceName = START_DEVICE,
  to: DeviceName = END_DEVICE,
  memo: Map<DeviceName, number> = new Map()
): number => {
  // Base case: reached destination
  if (from === to) return 1;
  
  // Check memoized result
  if (memo.has(from)) return memo.get(from)!;
  
  // Get outputs from this device
  const outputs = graph.get(from);
  if (!outputs || outputs.length === 0) {
    memo.set(from, 0);
    return 0;
  }
  
  // Sum paths through all outputs
  const totalPaths = outputs.reduce(
    (sum, output) => sum + countPaths(graph, output, to, memo),
    0
  );
  
  memo.set(from, totalPaths);
  return totalPaths;
};

/**
 * Part 1: Count all paths from 'you' to 'out'
 */
export const part1 = (graph: DeviceGraph): number => countPaths(graph);

/** Part 2 constants */
const SVR_DEVICE = 'svr' as DeviceName;
const DAC_DEVICE = 'dac' as DeviceName;
const FFT_DEVICE = 'fft' as DeviceName;

/**
 * Part 2: Count paths from 'svr' to 'out' that visit BOTH 'dac' AND 'fft'
 * 
 * A valid path must pass through both checkpoints. Since data flows one direction,
 * there are two orderings:
 * 1. svr → dac → fft → out (visit dac first, then fft)
 * 2. svr → fft → dac → out (visit fft first, then dac)
 * 
 * Total paths = paths(svr→dac) × paths(dac→fft) × paths(fft→out)
 *             + paths(svr→fft) × paths(fft→dac) × paths(dac→out)
 */
export const part2 = (graph: DeviceGraph): number => {
  // Path counts for ordering: dac first, then fft
  const svrToDac = countPaths(graph, SVR_DEVICE, DAC_DEVICE);
  const dacToFft = countPaths(graph, DAC_DEVICE, FFT_DEVICE);
  const fftToOut = countPaths(graph, FFT_DEVICE, END_DEVICE);
  const dacFirstPaths = svrToDac * dacToFft * fftToOut;
  
  // Path counts for ordering: fft first, then dac
  const svrToFft = countPaths(graph, SVR_DEVICE, FFT_DEVICE);
  const fftToDac = countPaths(graph, FFT_DEVICE, DAC_DEVICE);
  const dacToOut = countPaths(graph, DAC_DEVICE, END_DEVICE);
  const fftFirstPaths = svrToFft * fftToDac * dacToOut;
  
  return dacFirstPaths + fftFirstPaths;
};
