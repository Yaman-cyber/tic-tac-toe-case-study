import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../../../config/colors";

type Cell = -1 | 0 | 1;

type BoardProps = {
  board: Cell[][];
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
};

export default function Board({ board, onCellClick, disabled }: BoardProps) {
  const getSymbol = (value: Cell): string => {
    if (value === -1) return "X";
    if (value === 1) return "O";
    return "";
  };

  return (
    <View style={styles.board}>
      {board.map((row, i) =>
        row.map((cell, j) => (
          <TouchableOpacity key={`${i}-${j}`} style={styles.cell} onPress={() => onCellClick(i, j)} disabled={cell !== 0 || disabled}>
            <Text style={styles.cellText}>{getSymbol(cell)}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  cell: {
    width: 90,
    height: 90,
    margin: 5,
    backgroundColor: colors.grey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cellText: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
