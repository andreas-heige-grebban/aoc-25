/** Column index in the manifold grid (0-based) */
export type Column = number;

/** Count of parallel timelines/particles at a position */
export type TimelineCount = number;

/** Immutable array of grid rows */
export type Grid = readonly string[];

/**
 * Parsed tachyon manifold structure
 * @property grid - The manifold grid lines
 * @property startCol - Column where the beam enters (marked 'S')
 * @property width - Maximum width of the grid
 */
export type Manifold = Readonly<{
  grid: Grid;
  startCol: Column;
  width: number;
}>;

/**
 * Map of beam positions to timeline counts
 * Key: column index, Value: number of timelines at that position
 */
export type Beams = ReadonlyMap<Column, TimelineCount>;

/**
 * Result of processing a single row
 * @property beams - Updated beam positions after traversing the row
 * @property splitPositions - Number of unique splitter positions hit
 */
export type RowResult = Readonly<{
  beams: Beams;
  splitPositions: number;
}>;

/**
 * Internal simulation state during reduce
 * @property beams - Current beam positions
 * @property splits - Accumulated split count (Part 1)
 * @property splitPositions - Splits from current row
 */
export type SimState = Readonly<{
  beams: Beams;
  splits: number;
  splitPositions: number;
}>;

/**
 * Final simulation result
 * @property splits - Total splitter positions hit (Part 1 answer)
 * @property timelines - Total parallel timelines created (Part 2 answer)
 */
export type SimResult = Readonly<{
  splits: number;
  timelines: TimelineCount;
}>;

/**
 * Wrapper for timed execution results
 * @template T - Type of the computed result
 * @property result - The computed value
 * @property time - Execution time in milliseconds
 */
export type Timed<T> = Readonly<{
  result: T;
  time: number;
}>;
