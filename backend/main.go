package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sodukoSolver/backend/utils"

	"github.com/rs/cors"
)

// func printMatrix(matrix [9][9]int) {
// 	for i := 0; i < len(matrix); i++ {
// 		fmt.Println(matrix[i])
// 	}
// }

type SudokuInput struct {
	Matrix [9][9]int `json:"matrix"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var input SudokuInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	err, solvedMatrix := utils.SudokuSolver(input.Matrix)
	if err != nil {
		http.Error(w, "Failed to solve sudoku", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(solvedMatrix)
}

func main() {
	http.HandleFunc("/", Handler)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Server is running at http://localhost:8000")
	err := http.ListenAndServe(":8000", handler)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}
