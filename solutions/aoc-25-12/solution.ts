import type {
  Shape, ShapeCell, ShapeVariants, Region, PuzzleInput, RawInput, Coordinate,
  Grid, ShapeTypeInfo, ShapeToPlace, Placement, ShapeIndex, TypeIndex
} from './types';

/**
 * Parse a shape definition from lines of '#' and '.' characters.
 * Each '#' becomes a coordinate in the shape.
 * 
 * Example input:  ###
 *                 #..
 *                 ###
 * 
 * Returns: [[0,0], [0,1], [0,2], [1,0], [2,0], [2,1], [2,2]]
 */
export const parseShape = (lines: string[]): Shape => {
  const cells: ShapeCell[] = [];
  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    if (!line) continue;
    for (let col = 0; col < line.length; col++) {
      if (line[col] === '#') {
        cells.push([row as Coordinate, col as Coordinate]);
      }
    }
  }
  return cells;
};

/**
 * Parse a region specification line.
 * Format: "WIDTHxHEIGHT: qty0 qty1 qty2 ..."
 * 
 * Example: "12x5: 1 0 1 0 3 2" means:
 *   - Region is 12 units wide, 5 units tall
 *   - Need 1 of shape 0, 0 of shape 1, 1 of shape 2, etc.
 */
export const parseRegion = (line: string): Region => {
  const match = line.match(/^(\d+)x(\d+):\s*(.+)$/);
  if (!match || !match[1] || !match[2] || !match[3]) {
    throw new Error(`Invalid region line: ${line}`);
  }
  
  const width = parseInt(match[1]) as Coordinate;
  const height = parseInt(match[2]) as Coordinate;
  const quantities = match[3].trim().split(/\s+/).map(Number);
  
  return { width, height, quantities };
};

/**
 * Parse the complete puzzle input.
 * 
 * Input format:
 *   - Shape definitions: "N:" followed by lines of ###/.##/etc
 *   - Blank line separator
 *   - Region specifications: "WxH: qty0 qty1 ..."
 */
export const parseInput = (input: RawInput): PuzzleInput => {
  const sections = input.trim().split('\n\n');
  
  // Parse shapes (first N sections that start with "N:")
  const shapes: Shape[] = [];
  let regionStartIdx = 0;
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section) continue;
    if (section.match(/^\d+:/)) {
      // Shape definition
      const lines = section.split('\n').slice(1); // Skip "N:" line
      shapes.push(parseShape(lines));
      regionStartIdx = i + 1;
    } else {
      break;
    }
  }
  
  // Parse regions (remaining lines)
  const regionLines = sections.slice(regionStartIdx).join('\n').split('\n').filter(Boolean);
  const regions = regionLines.map(parseRegion);
  
  return { shapes, regions };
};

/**
 * Rotate shape 90° clockwise.
 * Transform: (row, col) → (col, -row)
 * 
 * Example:  ##.     →     #.
 *           .#.           ##
 *           ...           .#
 */
export const rotate90 = (shape: Shape): Shape => {
  const rotated = shape.map(([row, col]) => [col, -row] as [number, number]);
  return normalizeShape(rotated);
};

/**
 * Flip shape horizontally (mirror along vertical axis).
 * Transform: (row, col) → (row, -col)
 */
export const flipH = (shape: Shape): Shape => {
  const flipped = shape.map(([row, col]) => [row, -col] as [number, number]);
  return normalizeShape(flipped);
};

/**
 * Normalize shape so top-left cell is at origin (0,0).
 * Cells are sorted by row then column for consistent comparison.
 */
export const normalizeShape = (cells: [number, number][]): Shape => {
  if (cells.length === 0) return [];
  const minRow = Math.min(...cells.map(([row]) => row));
  const minCol = Math.min(...cells.map(([, col]) => col));
  return cells
    .map(([row, col]) => [(row - minRow) as Coordinate, (col - minCol) as Coordinate] as const)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};

/** Create a unique string key for shape deduplication */
const shapeKey = (shape: Shape): string =>
  shape.map(([row, col]) => `${row},${col}`).join(';');

/**
 * Generate all unique orientations of a shape (up to 8).
 * 
 * Combines 4 rotations × 2 flips = 8 possible orientations.
 * Symmetric shapes will have fewer unique variants.
 * 
 * Example: A square has 1 variant, an L-shape has 4, a Z-shape has 2.
 */
export const getAllVariants = (shape: Shape): ShapeVariants => {
  const variants: Shape[] = [];
  const seen = new Set<string>();
  
  let current = shape;
  for (let flipIndex = 0; flipIndex < 2; flipIndex++) {
    for (let rotationIndex = 0; rotationIndex < 4; rotationIndex++) {
      const key = shapeKey(current);
      if (!seen.has(key)) {
        seen.add(key);
        variants.push(current);
      }
      current = rotate90(current);
    }
    current = flipH(shape);
  }
  
  return variants;
};

/**
 * Check if a shape can be placed at the given position.
 * Returns false if any cell would be out of bounds or overlap an occupied cell.
 */
export const canPlace = (
  shape: Shape,
  row: number,
  col: number,
  width: number,
  height: number,
  grid: Grid
): boolean => {
  for (const [deltaRow, deltaCol] of shape) {
    const targetRow = row + deltaRow;
    const targetCol = col + deltaCol;
    if (targetRow < 0 || targetRow >= height || targetCol < 0 || targetCol >= width || grid[targetRow]![targetCol]) {
      return false;
    }
  }
  return true;
};

/** Place shape on grid at position. Marks cells as occupied. */
export const placeShape = (
  shape: Shape,
  row: number,
  col: number,
  grid: Grid
): void => {
  for (const [deltaRow, deltaCol] of shape) {
    grid[row + deltaRow]![col + deltaCol] = true;
  }
};

/** Remove shape from grid at position. Marks cells as empty. */
export const removeShape = (
  shape: Shape,
  row: number,
  col: number,
  grid: Grid
): void => {
  for (const [deltaRow, deltaCol] of shape) {
    grid[row + deltaRow]![col + deltaCol] = false;
  }
};

/**
 * Determine if all required shapes can fit in a region using backtracking.
 * 
 * Algorithm:
 *   1. Build list of shapes to place based on quantities
 *   2. Sort shapes: largest first, fewest variants first (more constrained)
 *   3. Precompute all valid placements for each shape variant
 *   4. Use backtracking with lexicographic ordering for identical shapes
 * 
 * Optimizations:
 *   - Early termination when remaining cells can't possibly fit
 *   - Lexicographic ordering avoids N! permutations of identical shapes
 *   - Precomputed placements avoid repeated bounds checking
 * 
 * @param region - The rectangular region to fill
 * @param allVariants - All rotation/flip variants for each shape type
 * @returns true if shapes can be placed without overlap
 */
export const canFitAllShapes = (
  region: Region,
  allVariants: ShapeVariants[]
): boolean => {
  const { width, height, quantities } = region;
  
  // Step 1: Collect shape types with their metadata
  const shapeTypes: ShapeTypeInfo[] = [];
  
  for (let shapeIndex = 0; shapeIndex < quantities.length; shapeIndex++) {
    const quantity = quantities[shapeIndex];
    const variants = allVariants[shapeIndex];
    if (quantity !== undefined && quantity > 0 && variants && variants.length > 0 && variants[0]) {
      shapeTypes.push({
        shapeIndex: shapeIndex as ShapeIndex,
        quantity,
        cellCount: variants[0].length,
        variantCount: variants.length
      });
    }
  }
  
  // No shapes to place = trivially satisfiable
  if (shapeTypes.length === 0) return true;
  
  // Step 2: Sort shapes for optimal search order
  // - Larger shapes first (fewer positions = more pruning)
  // - Fewer variants first (more constrained = fail faster)
  shapeTypes.sort((a, b) => {
    if (b.cellCount !== a.cellCount) return b.cellCount - a.cellCount;
    return a.variantCount - b.variantCount;
  });
  
  // Step 3: Expand shape types into individual shapes to place
  const shapesToPlace: ShapeToPlace[] = [];
  for (let typeIndex = 0; typeIndex < shapeTypes.length; typeIndex++) {
    const shapeType = shapeTypes[typeIndex];
    if (!shapeType) continue;
    const { shapeIndex, quantity, cellCount } = shapeType;
    for (let instanceIndex = 0; instanceIndex < quantity; instanceIndex++) {
      shapesToPlace.push({ shapeIndex, cellCount, typeIndex: typeIndex as TypeIndex });
    }
  }
  
  // Step 4: Verify total cells can fit (quick rejection)
  const totalCellsNeeded = shapesToPlace.reduce((sum, s) => sum + s.cellCount, 0);
  const totalArea = width * height;
  if (totalCellsNeeded > totalArea) return false;
  
  // Step 5: Create empty grid
  const grid: Grid = Array.from({ length: height }, () =>
    Array(width).fill(false)
  );
  
  // Step 6: Precompute all valid placements for each shape type
  // This avoids repeated bounds checking during backtracking
  const placementsByType: Placement[][] = shapeTypes.map(({ shapeIndex }) => {
    const placements: Placement[] = [];
    const variants = allVariants[shapeIndex];
    if (!variants) return placements;
    for (const variant of variants) {
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          let inBounds = true;
          for (const [deltaRow, deltaCol] of variant) {
            if (row + deltaRow >= height || col + deltaCol >= width) {
              inBounds = false;
              break;
            }
          }
          if (inBounds) {
            placements.push({ variant, row: row as Coordinate, col: col as Coordinate });
          }
        }
      }
    }
    return placements;
  });
  
  // Map each shape to its precomputed placements
  const allPlacements = shapesToPlace.map(shape => placementsByType[shape.typeIndex]);
  
  // Track cells used for early termination
  let cellsUsed = 0;
  
  // Step 7: Backtracking solver with lexicographic ordering
  // minPlacementIndex enforces ordering for identical shapes to avoid permutations
  const solve = (shapeIndex: number, minPlacementIndex: number): boolean => {
    if (shapeIndex >= shapesToPlace.length) return true;
    
    // Early termination
    const cellsRemaining = totalCellsNeeded - cellsUsed;
    if (cellsUsed + cellsRemaining > totalArea) return false;
    
    const shapeInfo = shapesToPlace[shapeIndex];
    if (!shapeInfo) return false;
    const { cellCount, typeIndex } = shapeInfo;
    const placements = allPlacements[shapeIndex];
    if (!placements) return false;
    
    // Determine starting index
    const previousShape = shapeIndex > 0 ? shapesToPlace[shapeIndex - 1] : undefined;
    const isSameTypeAsPrevious = previousShape && previousShape.typeIndex === typeIndex;
    const startIndex = isSameTypeAsPrevious ? minPlacementIndex : 0;
    
    for (let placementIndex = startIndex; placementIndex < placements.length; placementIndex++) {
      const placement = placements[placementIndex];
      if (!placement) continue;
      const { variant, row, col } = placement;
      
      // Check for collisions
      let canPlaceHere = true;
      for (const [deltaRow, deltaCol] of variant) {
        if (grid[row + deltaRow]![col + deltaCol]) {
          canPlaceHere = false;
          break;
        }
      }
      
      if (canPlaceHere) {
        // Place
        for (const [deltaRow, deltaCol] of variant) {
          grid[row + deltaRow]![col + deltaCol] = true;
        }
        cellsUsed += cellCount;
        
        if (solve(shapeIndex + 1, placementIndex)) return true;
        
        // Unplace
        for (const [deltaRow, deltaCol] of variant) {
          grid[row + deltaRow]![col + deltaCol] = false;
        }
        cellsUsed -= cellCount;
      }
    }
    
    return false;
  };
  
  return solve(0, 0);
};

/**
 * Part 1: Count how many regions can fit all their required presents.
 * 
 * For each region, check if all shapes (with given quantities) can be
 * placed without overlapping. Shapes can be rotated and flipped.
 * Empty cells are allowed (shapes don't need to fill the region).
 */
export const part1 = (input: PuzzleInput): number => {
  const { shapes, regions } = input;
  
  // Precompute all rotation/flip variants for each shape type
  const allVariants = shapes.map(getAllVariants);
  
  // Count regions where all shapes fit
  return regions.filter(region => canFitAllShapes(region, allVariants)).length;
};

/**
 * Part 2: TODO - Not yet implemented
 */
export const part2 = (_input: PuzzleInput): number => {
  return 0;
};