import type { Point, BoxPair, UnionFind, BoxIndex } from './types';
import { parseLines } from '../../utils';

/** Parse input into array of 3D points */
export const parseInput = (input: string): Point[] =>
  parseLines(input).map(line => {
    const [x, y, z] = line.split(',').map(Number);
    return { x: x ?? 0, y: y ?? 0, z: z ?? 0 };
  });

/** Calculate Euclidean distance between two points */
export const distance = (pointA: Point, pointB: Point): number =>
  Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2 + (pointB.z - pointA.z) ** 2);

/** Generate all pairs of boxes with their distances, sorted by distance */
export const generatePairs = (points: Point[]): BoxPair[] =>
  points
    .flatMap((point, index) =>
      points.slice(index + 1).map((otherPoint, offset) => ({
        i: index,
        j: index + 1 + offset,
        distance: distance(point, otherPoint)
      }))
    )
    .sort((a, b) => a.distance - b.distance);

/** Create a new Union-Find structure */
export const createUnionFind = (size: number): UnionFind => ({
  parent: Array.from({ length: size }, (_, index) => index),
  rank: Array(size).fill(0) as number[]
});

/** Find the root of a node with path compression */
export const find = (unionFind: UnionFind, node: BoxIndex): BoxIndex => {
  const parent = unionFind.parent[node];
  if (parent === node || parent === undefined) return node;
  return (unionFind.parent[node] = find(unionFind, parent));
};

/** Union two sets by rank, returns true if they were in different sets */
export const union = (unionFind: UnionFind, nodeA: BoxIndex, nodeB: BoxIndex): boolean => {
  const [rootA, rootB] = [find(unionFind, nodeA), find(unionFind, nodeB)];
  if (rootA === rootB) return false;
  const [rankA, rankB] = [unionFind.rank[rootA] ?? 0, unionFind.rank[rootB] ?? 0];
  const [smaller, larger] = rankA < rankB ? [rootA, rootB] : [rootB, rootA];
  unionFind.parent[smaller] = larger;
  if (rankA === rankB) unionFind.rank[larger] = rankA + 1;
  return true;
};

/** Get sizes of all circuits */
export const getCircuitSizes = (unionFind: UnionFind): number[] =>
  [...unionFind.parent.map((_, index) => find(unionFind, index)).reduce(
    (counts, root) => counts.set(root, (counts.get(root) ?? 0) + 1),
    new Map<number, number>()
  ).values()].sort((a, b) => b - a);

/** Connect n closest pairs and return product of top 3 circuit sizes */
export const solve = (input: string, connectionCount: number): number => {
  const points = parseInput(input);
  const unionFind = createUnionFind(points.length);
  generatePairs(points).slice(0, connectionCount).forEach(pair => union(unionFind, pair.i, pair.j));
  return getCircuitSizes(unionFind).slice(0, 3).reduce((product, size) => product * size, 1);
};

/** Part 1: Connect 1000 pairs, multiply top 3 circuit sizes */
export const part1 = (input: string): number => solve(input, 1000);
