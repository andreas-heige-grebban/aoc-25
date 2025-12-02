package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

// isInvalid checks if a number is made of a digit sequence repeated at least twice.
// For example: 55 (5 twice), 6464 (64 twice), 123123 (123 twice),
// 12341234 (1234 twice), 123123123 (123 three times), 1111111 (1 seven times) are invalid.
// Returns true if the number matches this pattern, false otherwise.
func isInvalid(num int64) bool {
	s := strconv.FormatInt(num, 10)
	len := len(s)

	// Try all possible pattern lengths (from 1 to len/2)
	// A pattern must divide the total length evenly
	for patternLen := 1; patternLen <= len/2; patternLen++ {
		// Check if this pattern length divides the total length
		if len%patternLen == 0 {
			pattern := s[:patternLen]
			repetitions := len / patternLen

			// Check if the entire string is this pattern repeated
			if repetitions >= 2 {
				isValid := true
				for i := 0; i < repetitions; i++ {
					if s[i*patternLen:(i+1)*patternLen] != pattern {
						isValid = false
						break
					}
				}
				if isValid {
					return true
				}
			}
		}
	}
	return false
}

func main() {
	// Read the input file containing comma-separated ranges
	data, err := os.ReadFile("input.txt")
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	// Parse the input: split by commas to get individual ranges
	input := strings.TrimSpace(string(data))
	ranges := strings.Split(input, ",")

	var sum int64

	// Process each range
	for _, r := range ranges {
		// Each range is in format "start-end", so split by dash
		parts := strings.Split(r, "-")
		if len(parts) != 2 {
			continue
		}

		// Convert range boundaries to integers
		start, err1 := strconv.ParseInt(parts[0], 10, 64)
		end, err2 := strconv.ParseInt(parts[1], 10, 64)

		if err1 != nil || err2 != nil {
			continue
		}

		// Iterate through each number in the range and check if it's invalid
		for num := start; num <= end; num++ {
			if isInvalid(num) {
				// Add invalid IDs to the sum
				sum += num
			}
		}
	}

	// Output the result
	fmt.Println(sum)
}
