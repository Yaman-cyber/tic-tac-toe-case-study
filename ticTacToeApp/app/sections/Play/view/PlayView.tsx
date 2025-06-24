import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import Board from "../components/Board";
import AppText from "../../../components/common/AppText";
import routes from "../../../navigation/routes";
import { RootStackParamList } from "../../../types/navigation";
import AppButton from "../../../components/common/AppButton";
import colors from "../../../config/colors";
import { startGame as startGameApi, playerMove, aiMove } from "../../../utils/api/v1/game";

export default function PlayView({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, typeof routes.PLAY> }) {
  const { t } = useTranslation();

  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<number[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [userSymbol, setUserSymbol] = useState<"x" | "o" | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const handleCellClick = async (row: number, col: number) => {
    if (!isUserTurn || board[row][col] !== 0 || loading || gameOver) return;
    setLoading(true);
    try {
      const playerMovePayload = {
        gameId: gameId!,
        state: { board },
        move: { row, col },
      };

      const { data: playerMoveRes } = await playerMove(playerMovePayload);
      const playerData = playerMoveRes.data;
      setBoard(playerData.boardState);
      if (playerData.status === "ended" || playerData.status === "completed") {
        setGameOver(true);
        setGameResult(playerData.result);
        setIsUserTurn(false);
        return;
      }
      setIsUserTurn(false);
      // AI move
      const aiMovePayload = {
        gameId: gameId!,
        board: playerData.boardState,
      };
      const { data: aiMoveRes } = await aiMove(aiMovePayload);
      const aiData = aiMoveRes.data;
      setBoard(aiData.boardState);
      if (aiData.status === "ended" || aiData.status === "completed") {
        setGameOver(true);
        setGameResult(aiData.result);
        setIsUserTurn(false);
        return;
      }
      setIsUserTurn(true);
    } catch (error: any) {
      setGameResult(error?.message || "An error occurred");
      setGameOver(true);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async (userFirst: boolean) => {
    setLoading(true);
    setGameOver(false);
    setGameResult(null);
    try {
      const payload = {
        firstMoveBy: userFirst ? ("user" as "user") : ("ai" as "ai"),
        aiPlayer: userFirst ? ("o" as "o") : ("x" as "x"),
        userPlayer: userFirst ? ("x" as "x") : ("o" as "o"),
      };
      setIsUserTurn(userFirst);
      const { data: response } = await startGameApi(payload);
      const data = response.data;

      setGameStarted(true);
      setBoard(data.boardState);
      setGameId(data._id);
      setUserSymbol(userFirst ? "x" : "o");

      if (data.firstMoveBy === "user") {
        setIsUserTurn(true);
      } else {
        // AI goes first
        const aiMovePayload = {
          gameId: data._id,
          board: data.boardState,
        };
        const { data: aiMoveRes } = await aiMove(aiMovePayload);
        const aiData = aiMoveRes.data;
        setBoard(aiData.boardState);
        if (aiData.status === "ended" || aiData.status === "completed") {
          setGameOver(true);
          setGameResult(aiData.result);
          setIsUserTurn(false);
          return;
        }
        setIsUserTurn(true);
      }
    } catch (error: any) {
      setGameResult(error?.message || "An error occurred");
      setGameOver(true);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setBoard([]);
    setGameStarted(false);
    setIsUserTurn(true);
    setGameOver(false);
    setGameResult(null);
    setGameId(null);
    setUserSymbol(null);
  };

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <>
          <AppText style={styles.title}>{t("Choose who plays first")}</AppText>
          <AppButton text={t("I'll go first")} buttonStyle={styles.button} onPress={() => startGame(true)} disabled={loading} />
          <AppButton text={t("Computer goes first")} buttonStyle={styles.button} onPress={() => startGame(false)} disabled={loading} />
          {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
        </>
      ) : (
        <>
          <AppText style={styles.status}>
            {gameOver ? `Game Over: ${gameResult}` : isUserTurn ? `Your turn (${userSymbol?.toUpperCase()})` : `Computer's turn (${userSymbol === "x" ? "O" : "X"})`}
          </AppText>
          <Board board={board as any} onCellClick={handleCellClick} disabled={!isUserTurn || gameOver} />

          <AppButton text={t("New Game")} buttonStyle={styles.button} onPress={resetGame} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white, padding: 20 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  button: { paddingVertical: 12, paddingHorizontal: 20, marginBottom: 10, borderRadius: 8, marginTop: 10 },
  buttonText: { color: colors.white, fontWeight: "600", fontSize: 16 },
  status: { fontSize: 20, marginBottom: 20, fontWeight: "500" },
  board: { width: 300, flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  cell: {
    width: 90,
    height: 90,
    margin: 5,
    backgroundColor: colors.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cellText: { fontSize: 32, fontWeight: "bold" },
});
