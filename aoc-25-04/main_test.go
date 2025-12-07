package main

import "testing"

func TestCountAdjacentRolls(t *testing.T) {
	for _, tt := range []struct {
		n       string
		g       []string
		r, c, e int
	}{
		{"isolated", []string{"...", ".@.", "..."}, 1, 1, 0},
		{"one neighbor", []string{"...", ".@@", "..."}, 1, 1, 1},
		{"four neighbors", []string{".@.", "@@@", ".@."}, 1, 1, 4},
		{"corner", []string{"@@", "@@"}, 0, 0, 3},
		{"eight neighbors", []string{"@@@", "@@@", "@@@"}, 1, 1, 8},
	} {
		t.Run(tt.n, func(t *testing.T) {
			if got := countAdjacentRolls(tt.g, tt.r, tt.c); got != tt.e {
				t.Errorf("got %d, want %d", got, tt.e)
			}
		})
	}
}

func TestCountAccessibleRolls(t *testing.T) {
	for _, tt := range []struct {
		n string
		g []string
		e int
	}{
		{"all accessible", []string{"@.@", "...", "@.@"}, 4},
		{"corners only", []string{"@@@@", "@@@@", "@@@@", "@@@@"}, 4},
		{"mixed", []string{"@@.", "@@@", ".@@"}, 2},
	} {
		t.Run(tt.n, func(t *testing.T) {
			if got := countAccessibleRolls(tt.g); got != tt.e {
				t.Errorf("got %d, want %d", got, tt.e)
			}
		})
	}
}

func TestCalculateTotalRemovable(t *testing.T) {
	for _, tt := range []struct {
		n string
		g []string
		e int
	}{
		{"all removable", []string{"@.@", "...", "@.@"}, 4},
		{"cascade", []string{"@@.", "@@@", ".@@"}, 7},
		{"no rolls", []string{"..."}, 0},
	} {
		t.Run(tt.n, func(t *testing.T) {
			if got := calculateTotalRemovable(tt.g); got != tt.e {
				t.Errorf("got %d, want %d", got, tt.e)
			}
		})
	}
}
