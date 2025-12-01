package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func main() {
	file, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	position := 50
	zerosCount := 0

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

		// Apply rotation
		if direction == 'L' {
			position -= distance
		} else if direction == 'R' {
			position += distance
		}

		// Normalize to 0-99 range (circular dial)
		position = ((position % 100) + 100) % 100

		// Check if pointing at 0
		if position == 0 {
			zerosCount++
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Password: %d\n", zerosCount)
}
