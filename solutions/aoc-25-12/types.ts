/** Brand helper type for creating nominal types */
type Brand<T, B extends string> = T & { readonly __brand: B };

/** Type-safe coordinate value (row or column position) */
export type Coordinate = Brand<number, 'Coordinate'>;

/** Type-safe index into the shapes array */
export type ShapeIndex = Brand<number, 'ShapeIndex'>;

/** Type-safe index into the shapeTypes array (sorted order) */
export type TypeIndex = Brand<number, 'TypeIndex'>;

/** Raw puzzle input string (unprocessed) */
export type RawInput = Brand<string, 'RawInput'>;

/** A position on the grid (row, column) */
export interface Position {
  readonly row: Coordinate;
  readonly col: Coordinate;
}

/** Dimensions of a rectangular area */
export interface Dimensions {
  readonly width: Coordinate;
  readonly height: Coordinate;
}

/** A cell offset within a shape (relative to placement position) */
export type ShapeCell = readonly [deltaRow: Coordinate, deltaCol: Coordinate];

/** A shape is a list of relative cell offsets where '#' appears */
export type Shape = readonly ShapeCell[];

/** All unique rotation/flip variants of a shape (1-8 variants) */
export type ShapeVariants = readonly Shape[];

/** Number of cells a shape occupies */
export type CellCount = number;

/** A region to fill with presents */
export interface Region extends Dimensions {
  /** quantities[shapeIndex] = how many of that shape to place */
  readonly quantities: readonly number[];
}

/** Complete parsed puzzle input */
export interface PuzzleInput {
  readonly shapes: readonly Shape[];
  readonly regions: readonly Region[];
}

/** Grid cell state: true = occupied, false = empty */
export type Grid = boolean[][];

/** Metadata for a shape type during solving (before expansion) */
export interface ShapeTypeInfo {
  readonly shapeIndex: ShapeIndex;
  readonly quantity: number;
  readonly cellCount: CellCount;
  readonly variantCount: number;
}

/** Individual shape instance to place during backtracking */
export interface ShapeToPlace {
  readonly shapeIndex: ShapeIndex;
  readonly cellCount: CellCount;
  readonly typeIndex: TypeIndex;
}

/** A specific placement of a shape variant at a grid position */
export interface Placement extends Position {
  readonly variant: Shape;
}
