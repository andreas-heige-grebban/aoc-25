import type { Column, TimelineCount, Grid, Manifold, Beams, RowResult, SimState, SimResult } from './types.ts';

/** Parse input string into a Manifold structure, finding grid dimensions and start position */
export const parseInput = (input: string): Manifold => {
  const grid: Grid = input.split('\n').filter((line): line is string => line.length > 0);
  return {
    grid,
    width: Math.max(...grid.map((line: string): number => line.length)),
    startCol: grid[0].indexOf('S')
  };
};

/** Determine new column positions for a beam: split left/right on '^', continue on '.'/space, stop otherwise */
export const getNewBeamCols = (col: Column, line: string, width: number): readonly Column[] =>
  line[col] === '^' ? [col - 1, col + 1].filter((c: Column): boolean => c >= 0 && c < width)
  : line[col] === '.' || line[col] === ' ' ? [col]
  : [];

/** Process all beams through one row, counting splits and computing new beam positions with timeline counts */
export const processRow = (beams: Beams, line: string, width: number): RowResult => {
  const entries: readonly [Column, TimelineCount][] = [...beams.entries()];
  const splitPositions: number = entries.filter(([col]): boolean => line[col] === '^').length;
  const newBeams: Map<Column, TimelineCount> = entries.reduce(
    (beamMap: Map<Column, TimelineCount>, [col, count]: [Column, TimelineCount]): Map<Column, TimelineCount> => {
      getNewBeamCols(col, line, width).forEach((newCol: Column): void => {
        beamMap.set(newCol, (beamMap.get(newCol) ?? 0) + count);
      });
      return beamMap;
    },
    new Map<Column, TimelineCount>()
  );
  
  return { beams: newBeams, splitPositions };
};

/** Sum all timeline counts in a beam map */
export const sumValues = (map: Beams): TimelineCount => 
  [...map.values()].reduce((a: TimelineCount, b: TimelineCount): TimelineCount => a + b, 0);

/** Simulate beams through the entire manifold, returning total splits (Part 1) and timelines (Part 2) */
export const simulate = ({ grid, startCol, width }: Manifold): SimResult => (
  ({ beams, splits }: SimState): SimResult => ({ splits, timelines: sumValues(beams) })
)(grid.slice(1).map((line: string): string => line.padEnd(width)).reduce<SimState>(
  (state: SimState, line: string): SimState => state.beams.size === 0 ? state : 
    ((row: RowResult): SimState => ({ ...row, splits: state.splits + row.splitPositions }))(processRow(state.beams, line, width)),
  { beams: new Map<Column, TimelineCount>([[startCol, 1]]), splits: 0, splitPositions: 0 }
));
