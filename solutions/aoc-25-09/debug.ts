import { parseInput, getEdgeTiles } from './solution';

const example = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

const tiles = parseInput(example);
console.log("Red tiles:", tiles);

// Build boundary set
const boundary = new Set<string>();
for (const tile of tiles) {
  boundary.add(`${tile.x},${tile.y}`);
}
const edgeTiles = getEdgeTiles(tiles);
for (const tile of edgeTiles) {
  boundary.add(`${tile.x},${tile.y}`);
}
console.log("\nBoundary size:", boundary.size);
console.log("Boundary includes (2,3)?", boundary.has("2,3"));
console.log("Boundary includes (2,4)?", boundary.has("2,4"));
console.log("Boundary includes (2,5)?", boundary.has("2,5"));
console.log("Boundary includes (3,3)?", boundary.has("3,3"));
console.log("Boundary includes (3,5)?", boundary.has("3,5"));

// Build vertical segments
const segments = new Map<number, [number, number][]>();
for (let i = 0; i < tiles.length; i++) {
  const current = tiles[i]!;
  const next = tiles[(i + 1) % tiles.length]!;
  if (current.x === next.x) {
    const x = current.x;
    const yMin = Math.min(current.y, next.y);
    const yMax = Math.max(current.y, next.y);
    if (!segments.has(x)) segments.set(x, []);
    segments.get(x)!.push([yMin, yMax]);
    console.log(`Vertical segment at x=${x}: y ${yMin} to ${yMax}`);
  }
}

// Check specific points
function checkPoint(x: number, y: number) {
  // First check boundary
  if (boundary.has(`${x},${y}`)) return { onBoundary: true, crossings: 0, inside: true };
  
  let crossings = 0;
  for (const [segX, segs] of segments) {
    if (segX >= x) continue;
    for (const [yMin, yMax] of segs) {
      // Include lower endpoint, exclude upper
      if (y >= yMin && y < yMax) {
        crossings++;
      }
    }
  }
  const inside = crossings % 2 === 1;
  return { onBoundary: false, crossings, inside };
}

// Test rectangle (2,3) to (9,5)
console.log("\n=== Testing rectangle (2,3) to (9,5) ===");
let allInside = true;
for (let y = 3; y <= 5; y++) {
  let row = "";
  for (let x = 2; x <= 9; x++) {
    const result = checkPoint(x, y);
    if (result.onBoundary) {
      row += "B";
    } else {
      row += result.inside ? "I" : "O";
    }
    if (!result.inside && !result.onBoundary) allInside = false;
  }
  console.log(`y=${y}: ${row}`);
}
console.log(`All inside: ${allInside}`);
