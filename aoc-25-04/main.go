package main

import (
	"fmt"
	"os"
	"strings"
	"time"
)

func main() {
	startTime := time.Now()
	defer func() {
		fmt.Printf("Execution Time: %fs\n", time.Since(startTime).Seconds())
	}()
	fileBytes, _ := os.ReadFile("input.txt")
	grid := strings.Split(strings.TrimSpace(string(fileBytes)), "\n")

	// --- Part 1 ---
	part1Result := countAccessibleRolls(grid)
	fmt.Println("Part 1 Total accessible rolls:", part1Result)

	// --- Part 2 ---
	part2Result := calculateTotalRemovable(grid)
	fmt.Println("Part 2 Total removed rolls:", part2Result)
}

// countAdjacentRolls counts the neighbors for a given cell in a grid.
func countAdjacentRolls(grid []string, row, col int) int {
	adjacentRollsCount := 0
	for deltaRow := -1; deltaRow <= 1; deltaRow++ {
		for deltaCol := -1; deltaCol <= 1; deltaCol++ {
			if (deltaRow != 0 || deltaCol != 0) &&
				row+deltaRow >= 0 && row+deltaRow < len(grid) &&
				col+deltaCol >= 0 && col+deltaCol < len(grid[row]) &&
				grid[row+deltaRow][col+deltaCol] == '@' {
				adjacentRollsCount++
			}
		}
	}
	return adjacentRollsCount
}

// countAccessibleRolls solves Part 1.
func countAccessibleRolls(grid []string) int {
	accessibleRolls := 0
	for rowIndex, rowString := range grid {
		for colIndex, cell := range rowString {
			if cell == '@' && countAdjacentRolls(grid, rowIndex, colIndex) < 4 {
				accessibleRolls++
			}
		}
	}
	return accessibleRolls
}

// calculateTotalRemovable solves Part 2.
func calculateTotalRemovable(originalGrid []string) int {
	// Create a mutable copy of the grid as a slice of byte slices
	grid := make([][]byte, len(originalGrid))
	for i, s := range originalGrid {
		grid[i] = []byte(s)
	}

	totalRemoved := 0
	for {
		// Find all rolls that can be removed in this iteration
		removableRolls := findRemovableRolls(grid)

		if len(removableRolls) == 0 {
			break // No more rolls can be removed, exit the loop
		}

		totalRemoved += len(removableRolls)

		// Remove the rolls from the grid for the next iteration
		for _, pos := range removableRolls {
			grid[pos[0]][pos[1]] = '.'
		}
	}
	return totalRemoved
}

// findRemovableRolls scans the grid and returns the coordinates of all rolls
// with fewer than 4 neighbors.
func findRemovableRolls(grid [][]byte) [][2]int {
	var toRemove [][2]int
	for r, row := range grid {
		for c, cell := range row {
			if cell == '@' && countNeighbors(grid, r, c) < 4 {
				toRemove = append(toRemove, [2]int{r, c})
			}
		}
	}
	return toRemove
}

// countNeighbors counts adjacent rolls for a cell in a [][]byte grid.
func countNeighbors(grid [][]byte, r, c int) int {
	adjacentCount := 0
	for dr := -1; dr <= 1; dr++ {
		for dc := -1; dc <= 1; dc++ {
			if (dr != 0 || dc != 0) && r+dr >= 0 && r+dr < len(grid) && c+dc >= 0 && c+dc < len(grid[r]) && grid[r+dr][c+dc] == '@' {
				adjacentCount++
			}
		}
	}
	return adjacentCount
}
