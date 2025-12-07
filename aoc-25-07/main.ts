import * as fs from 'fs';

type Manifold = { grid: string[]; startCol: number; width: number };
type BeamResult = { splits: number; newCols: number[] };
type SimState = { beams: Set<number>; splits: number };
type Timed<T> = { result: T; time: number };

const parseInput = (input: string): Manifold => {
  const grid = input.split('\n').filter(line => line.length > 0);
  return {
    grid,
    width: Math.max(...grid.map(l => l.length)),
    startCol: grid[0].indexOf('S')
  };
}

const processBeam = (col: number, line: string, width: number): BeamResult =>
  line[col] === '^' ? { splits: 1, newCols: [col - 1, col + 1].filter(c => c >= 0 && c < width) }
  : line[col] === '.' || line[col] === ' ' ? { splits: 0, newCols: [col] }
  : { splits: 0, newCols: [] };

const processRow = (beams: Set<number>, line: string, width: number): SimState => ({
  splits: [...beams].filter(col => line[col] === '^').length,
  beams: new Set([...beams].flatMap(col => processBeam(col, line, width).newCols))
});

const simulateBeams = ({ grid, startCol, width }: Manifold): number =>
  grid.slice(1).map(line => line.padEnd(width)).reduce<SimState>(
    (state, line) => state.beams.size === 0 ? state : {
      beams: processRow(state.beams, line, width).beams,
      splits: state.splits + processRow(state.beams, line, width).splits
    },
    { beams: new Set([startCol]), splits: 0 }
  ).splits;

const timed = <T>(fn: () => T): Timed<T> => {
  const start = performance.now();
  return { result: fn(), time: performance.now() - start };
}

const main = (): void => {
  const totalStart = performance.now();
  
  const { result: input, time: readTime } = timed(() => fs.readFileSync('input.txt', 'utf-8'));
  const { result: result1, time: executeTime } = timed(() => simulateBeams(parseInput(input)));

  console.log('Part 1:', result1);
  console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
  console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
  console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
}

main();
