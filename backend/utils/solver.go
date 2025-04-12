package utils

import (
	"errors"
)

func checkCol(matrix [9][9]int, i int, num int) bool {
	for ind := 0; ind < 9; ind++ {
		// col , Row
		// fmt.Println(matrix[ind][i])
		if matrix[ind][i] == num {
			return false
		}
	}
	return true
}

func checkRow(matrix [9][9]int, i int, num int) bool {
	for ind := 0; ind < 9; ind++ {
		// fmt.Print(matrix[i][ind])
		if matrix[i][ind] == num {
			return false
		}
	}
	return true
}

func checkSquare(matrix [9][9]int, i int, j int, num int) bool {
	// Top-left square
	if i >= 0 && i <= 2 && j >= 0 && j <= 2 {
		for row := 0; row <= 2; row++ {
			for col := 0; col <= 2; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	// Top-midle square
	if i >= 0 && i <= 2 && j >= 3 && j <= 5 {
		for row := 0; row <= 2; row++ {
			for col := 3; col <= 5; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	// Top-right square
	if i >= 0 && i <= 2 && j >= 6 && j <= 8 {
		for row := 0; row <= 2; row++ {
			for col := 6; col <= 8; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	// ------------------
	// midle-left square
	if i >= 3 && i <= 5 && j >= 0 && j <= 2 {
		for row := 3; row <= 5; row++ {
			for col := 0; col <= 2; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	// midle-midle square
	if i >= 3 && i <= 5 && j >= 3 && j <= 5 {
		for row := 3; row <= 5; row++ {
			for col := 3; col <= 5; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	// midle-right square
	if i >= 3 && i <= 5 && j >= 6 && j <= 8 {
		for row := 3; row <= 5; row++ {
			for col := 6; col <= 8; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	// ------------------
	// bottom-left square
	if i >= 6 && i <= 8 && j >= 0 && j <= 2 {
		for row := 6; row <= 8; row++ {
			for col := 0; col <= 2; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	// bottom-midle square
	if i >= 6 && i <= 8 && j >= 3 && j <= 5 {
		for row := 6; row <= 8; row++ {
			for col := 3; col <= 5; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	// buttom-right square
	if i >= 6 && i <= 8 && j >= 6 && j <= 8 {
		for row := 6; row <= 8; row++ {
			for col := 6; col <= 8; col++ {
				if num == matrix[row][col] {
					return false
				}
			}
		}
	}
	return true
}

func isValid(matrix [9][9]int, i int, j int, num int) bool {
	// check Col
	c := checkCol(matrix, j, num)
	// fmt.Println("Col :",c)
	// check Row
	r := checkRow(matrix, i, num)
	// fmt.Println("Row :",r)
	// check Square
	s := checkSquare(matrix, i, j, num)
	// fmt.Println("Square :",s)
	// if valid return true else false
	if r && c && s {
		return true
	}
	return false
}

func solve(matrix *[9][9]int, r, c int) bool {
	if r == 9 {
		return true
	} else if c == 9 {
		return solve(matrix, r+1, 0)
	} else if matrix[r][c] != 0 {
		return solve(matrix, r, c+1)
	} else {
		for i := 1; i <= 9; i++ {
			if isValid(*matrix, r, c, i) {
				matrix[r][c] = i
				if solve(matrix, r, c+1) {
					return true
				}
				matrix[r][c] = 0
			}
		}
		return false
	}
}

func isInitialMatrixValid(matrix [9][9]int) bool {
	for i := 0; i < 9; i++ {
		for j := 0; j < 9; j++ {
			num := matrix[i][j]
			if num != 0 {
				matrix[i][j] = 0 // temporarily remove the number
				if !isValid(matrix, i, j, num) {
					return false
				}
				matrix[i][j] = num // put it back
			}
		}
	}
	return true
}

func SudokuSolver(matrix [9][9]int) (error, [9][9]int) {
	if !isInitialMatrixValid(matrix) {
		return errors.New("invalid initial sudoku board"), matrix
	}

	var copied [9][9]int
	for i := range matrix {
		for j := range matrix[i] {
			copied[i][j] = matrix[i][j]
		}
	}

	ok := solve(&copied, 0, 0)
	if !ok {
		return errors.New("no solution found"), matrix
	}
	return nil, copied
}
