"use client";

import { useRef, useState } from "react";

const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(""));

export default function SudokuSolver() {
  const [grid, setGrid] = useState<string[][]>(emptyGrid);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );

  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [solution, setSolution] = useState<number[][] | null>(null);

  const focusCell = (row: number, col: number) => {
    if (row >= 0 && row < 9 && col >= 0 && col < 9) {
      inputRefs.current[row][col]?.focus();
    }
  };

  const handleChange = (
    row: number,
    col: number,
    value: string,
    paste = false
  ) => {
    const newGrid = grid.map((r) => [...r]);

    if (paste) {
      const lines = value.trim().split(/\r?\n/);
      let currentRow = row;
      let currentCol = col;

      for (const line of lines) {
        for (const char of line) {
          if (!/^\d$/.test(char)) continue;

          if (char === "0") {
            newGrid[currentRow][currentCol] = "";
          } else {
            newGrid[currentRow][currentCol] = char;
          }

          if (currentCol < 8) {
            currentCol++;
          } else if (currentRow < 8) {
            currentCol = 0;
            currentRow++;
          } else {
            break;
          }
        }

        // Move to start of next row if line ends early
        if (currentRow < 8 && currentCol === 9) {
          currentRow++;
          currentCol = 0;
        }
      }

      setGrid(newGrid);
      focusCell(currentRow, currentCol);
    } else {
      // Manual typing
      const char = value[value.length - 1];
      if (!/^\d$/.test(char)) return;

      const newVal = char === "0" ? "" : char;
      newGrid[row][col] = newVal;
      setGrid(newGrid);

      // Move forward
      if (col < 8) focusCell(row, col + 1);
      else if (row < 8) focusCell(row + 1, 0);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const newGrid = grid.map((r) => [...r]);

    // BACKSPACE
    if (e.key === "Backspace") {
      e.preventDefault();
      if (grid[row][col] !== "") {
        newGrid[row][col] = "";
        setGrid(newGrid);
      } else if (col > 0) {
        focusCell(row, col - 1);
      } else if (row > 0) {
        focusCell(row - 1, 8);
      }
    }

    // SPACE
    if (e.key === " ") {
      e.preventDefault();
      if (col < 8) focusCell(row, col + 1);
      else if (row < 8) focusCell(row + 1, 0);
    }

    // ARROWS
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        if (col < 8) focusCell(row, col + 1);
        else if (row < 8) focusCell(row + 1, 0);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (col > 0) focusCell(row, col - 1);
        else if (row > 0) focusCell(row - 1, 8);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (row > 0) focusCell(row - 1, col);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (row < 8) focusCell(row + 1, col);
        break;
    }
  };

  const postData = async () => {
    const numericGrid = grid.map((row) =>
      row.map((cell) => parseInt(cell) || 0)
    );
    const response = await fetch("https://sudoku-solver-production-b32f.up.railway.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matrix: numericGrid,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Backend Response:", result);

      if (
        Array.isArray(result) &&
        result.length === 9 &&
        result.every((row) => Array.isArray(row) && row.length === 9)
      ) {
        setSolution(result);
        setPopupMessage("Solution found!");
      } else {
        setPopupMessage("Invalid input. Please check the grid and try again.");
        setSolution(null);
      }
    } else {
      setPopupMessage("Invalid input. Please check the grid and try again.");
      setSolution(null);
    }
  };

  const renderSolution = (solution: number[][]) => {
    if (!solution) return null;

    return solution.map((row, rowIndex) => (
      <div key={rowIndex} className="flex space-x-2">
        {row.map((cell, colIndex) => (
          <span key={colIndex} className="text-lg">
            {cell === 0 ? "." : cell}
          </span>
        ))}
      </div>
    ));
  };

  const closePopup = () => {
    setPopupMessage(null);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    const popup = document.getElementById("popup");
    if (popup && !popup.contains(e.target as Node)) {
      closePopup();
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle,_rgba(255,_255,_255,_1)_0%,_rgba(74,_104,_255,_1)_100%)] p-4"
      onClick={handleClickOutside}
    >
      <h1 className="text-2xl font-bold mb-4">Sudoku Solver</h1>
      <div className="grid grid-cols-9 gap-1 mb-4">
  {grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => (
      <input
        key={`${rowIndex}-${colIndex}`}
        ref={(el) => {
          inputRefs.current[rowIndex][colIndex] = el;
        }}
        value={cell}
        onPaste={(e) => {
          const pasteText = e.clipboardData.getData("text");
          e.preventDefault();
          handleChange(rowIndex, colIndex, pasteText, true);
        }}
        onChange={(e) =>
          handleChange(rowIndex, colIndex, e.target.value, false)
        }
        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
        className={`w-10 h-10 text-center border border-gray-400 bg-white rounded-sm text-lg focus:outline-none
          ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-4 border-black" : ""}
          ${colIndex % 3 === 2 && colIndex !== 8 ? "border-r-4 border-black" : ""}`}
        maxLength={9}
        inputMode="numeric"
      />
    ))
  )}
</div>

      <button
        onClick={postData}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Solve
      </button>

      {popupMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 ">
          <div
            id="popup"
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col items-center justify-center relative"
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-5 text-xl text-red-700 hover:text-red-800"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              {popupMessage === "Solution found!" ? "Solution" : "Error"}
            </h2>
            <div
              className={`${popupMessage === "Solution found!" ? "text-black" : "text-red-600"
                } mb-4 text-center`}
            >
              {popupMessage === "Solution found!" ? (
                <div>{renderSolution(solution!)}</div>
              ) : (
                popupMessage
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
