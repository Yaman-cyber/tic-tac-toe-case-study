import React from "react";

export default function Board({ board, onCellClick, isUserTurn }) {
  const getCellDisplay = (value) => {
    switch (value) {
      case -1:
        return "X";
      case 1:
        return "O";
      default:
        return "";
    }
  };

  return (
    <div className="w-[280px] grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-lg">
      {board.map((row, i) =>
        row.map((cell, j) => (
          <button
            key={`${i}-${j}`}
            className={`
              w-20 h-20 bg-white rounded-lg
              flex items-center justify-center
              ${cell === 0 ? "hover:bg-gray-50" : "cursor-default"}
              transition-colors duration-200
            `}
            onClick={() => onCellClick(i, j)}
            disabled={cell !== 0}
          >
            <span className="text-4xl font-bold leading-none">{getCellDisplay(cell)}</span>
          </button>
        ))
      )}
    </div>
  );
}
