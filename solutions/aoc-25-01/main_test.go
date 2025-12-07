package main

import "testing"

func TestCountZerosCrossedSimple(t *testing.T) {
	for _, tt := range []struct {
		name                      string
		start, distance, expected int
		direction                 rune
	}{
		{"right crossing one zero", 98, 5, 1, 'R'},
		{"left crossing one zero", 2, 5, 1, 'L'},
		{"no zeros crossed", 50, 10, 0, 'R'},
		{"ending on zero doesn't count", 95, 5, 0, 'R'},
		{"multiple zeros right", 50, 150, 1, 'R'},
		{"multiple zeros left", 50, 150, 1, 'L'},
	} {
		t.Run(tt.name, func(t *testing.T) {
			if got := countZerosCrossedSimple(tt.start, tt.distance, tt.direction); got != tt.expected {
				t.Errorf("got %d, want %d", got, tt.expected)
			}
		})
	}
}
