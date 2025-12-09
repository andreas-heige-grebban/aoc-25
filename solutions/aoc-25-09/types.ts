/** Coordinate component (x or y position on grid) */
export type Coordinate = number;

/** 2D position of a red tile on the theater grid */
export type RedTile = Readonly<{
  readonly x: Coordinate;
  readonly y: Coordinate;
}>;

/** Collection of red tiles forming potential rectangle corners */
export type RedTiles = readonly RedTile[];

/** Pair of red tiles that could form opposite corners of a rectangle */
export type TilePair = readonly [RedTile, RedTile];

/** Rectangle area in square units (inclusive of boundaries) */
export type Area = number;

/** Raw puzzle input as newline-separated coordinates */
export type PuzzleInput = string;
