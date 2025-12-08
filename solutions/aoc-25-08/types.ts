/** A point in 3D space representing a junction box location */
export type Point = Readonly<{
  x: number;
  y: number;
  z: number;
}>;

/** Index reference to a junction box in the collection */
export type BoxIndex = number;

/** A pair of junction boxes with their Euclidean distance */
export type BoxPair = Readonly<{
  /** Index of the first junction box */
  i: BoxIndex;
  /** Index of the second junction box */
  j: BoxIndex;
  /** Euclidean distance between the two boxes */
  distance: number;
}>;

/**
 * Union-Find (Disjoint Set Union) data structure
 * Used for efficiently tracking connected circuits
 */
export type UnionFind = {
  /** Maps each node to its parent (or itself if root) */
  parent: number[];
  /** Rank for union by rank optimization */
  rank: number[];
};
