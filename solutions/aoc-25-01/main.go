package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func countZerosCrossedSimple(start int, distance int, direction rune) int {
	count := 0
	pos := start

	if direction == 'R' {
		for i := 0; i < distance; i++ {
			pos++
			if pos%100 == 0 && i < distance-1 { // Don't count the final position
				count++
			}
		}
	} else {
		for i := 0; i < distance; i++ {
			pos--
			if pos%100 == 0 && i < distance-1 { // Don't count the final position
				count++
			}
		}
	}

	return count
}

func main() {
	file, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	position := 50
	part1Zeros := 0
	part2Zeros := 0

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}

		// Parse the rotation instruction
		direction := rune(line[0])
		distance, err := strconv.Atoi(line[1:])
		if err != nil {
			log.Fatal(err)
		}

		// Part 2: Count zeros during the rotation (intermediate clicks, not final position)
		part2Zeros += countZerosCrossedSimple(position, distance, direction)

		// Apply rotation
		if direction == 'L' {
			position -= distance
		} else if direction == 'R' {
			position += distance
		}

		// Normalize to 0-99 range (circular dial)
		position = ((position % 100) + 100) % 100

		// Part 1: Check if pointing at 0 at end of rotation
		if position == 0 {
			part1Zeros++
			part2Zeros++ // Also count this in Part 2
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Part 1 Password: %d\n", part1Zeros)
	fmt.Printf("Part 2 Password: %d\n", part2Zeros)
}
