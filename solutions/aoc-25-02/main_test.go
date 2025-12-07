package main

import "testing"

func TestIsInvalid(t *testing.T) {
	for _, tt := range []struct {
		name     string
		num      int64
		expected bool
	}{
		{"55 - repeated twice", 55, true},
		{"6464 - two-digit twice", 6464, true},
		{"123123 - three-digit twice", 123123, true},
		{"12341234 - four-digit twice", 12341234, true},
		{"123123123 - three-digit thrice", 123123123, true},
		{"1111111 - single seven times", 1111111, true},
		{"11 - single twice", 11, true},
		{"111 - single thrice", 111, true},
		{"100100 - with zeros", 100100, true},
		{"101010 - 10 thrice", 101010, true},
		{"12 - two different", 12, false},
		{"123 - three different", 123, false},
		{"1234 - four different", 1234, false},
		{"1231 - almost pattern", 1231, false},
		{"12345 - odd length", 12345, false},
		{"5 - single digit", 5, false},
		{"12312 - incomplete", 12312, false},
	} {
		t.Run(tt.name, func(t *testing.T) {
			if got := isInvalid(tt.num); got != tt.expected {
				t.Errorf("got %v, want %v", got, tt.expected)
			}
		})
	}
}
