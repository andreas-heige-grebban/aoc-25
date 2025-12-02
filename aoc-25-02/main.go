package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

// isInvalid checks if a number is made of a digit sequence repeated exactly twice.
// For example: 55 (5 twice), 6464 (64 twice), 123123 (123 twice) are invalid.
// Returns true if the number matches this pattern, false otherwise.
func isInvalid(num int64) bool {
	s := strconv.FormatInt(num, 10)

	// Invalid IDs must have even length
	if len(s)%2 != 0 {
		return false
	}

	// Split the string in half and check if both halves are identical
	mid := len(s) / 2
	return s[:mid] == s[mid:]
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
