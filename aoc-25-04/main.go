package main

import (
	"fmt"
	"os"
	"strings"
	"time"
)

func main() {
	totalStart := time.Now()

	readStart := time.Now()
	fileBytes, _ := os.ReadFile("input.txt")
	grid := strings.Split(strings.TrimSpace(string(fileBytes)), "\n")
	fmt.Printf("File Read took %fs\n", float64(time.Since(readStart).Nanoseconds())/1e9)

	accessibleRolls := 0
	for rowIndex, rowString := range grid {
		for colIndex, cell := range rowString {
			if cell != '@' {
				continue
			}

			adjacentRollsCount := 0
			for deltaRow := -1; deltaRow <= 1; deltaRow++ {
				for deltaCol := -1; deltaCol <= 1; deltaCol++ {
					if (deltaRow != 0 || deltaCol != 0) &&
						rowIndex+deltaRow >= 0 && rowIndex+deltaRow < len(grid) &&
						colIndex+deltaCol >= 0 && colIndex+deltaCol < len(rowString) &&
						grid[rowIndex+deltaRow][colIndex+deltaCol] == '@' {
						adjacentRollsCount++
					}
				}
			}

			if adjacentRollsCount < 4 {
				accessibleRolls++
			}
		}
	}
	fmt.Println("Total accessible rolls:", accessibleRolls)
	fmt.Printf("Total Execution took %fs\n", float64(time.Since(totalStart).Nanoseconds())/1e9)
}
