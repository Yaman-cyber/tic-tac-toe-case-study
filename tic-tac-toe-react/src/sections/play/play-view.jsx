import React, { useState } from "react";
import { toast } from "react-toastify";

import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Board from "./components/Board";
import { startGame as startGameApi, playerMove, aiMove } from "../../utils/api/v1/game";

export default function PlayView() {
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [userSymbol, setUserSymbol] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const handleCellClick = async (row, col) => {
    if (board[row][col] !== 0 || loading || gameOver) return;
    setLoading(true);

    try {
      const playerMovePayload = {
        gameId,
        state: { board },
        move: { row, col },
      };
      const { data: playerMoveRes } = await playerMove(playerMovePayload);
      const playerData = playerMoveRes.data;
      setBoard(playerData.boardState);
      if (playerData.status === "ended") {
        setGameOver(true);
        setGameResult(playerData.result);
        setIsUserTurn(false);
        return;
      }
      setIsUserTurn(false);
      // AI move
      const aiMovePayload = {
        gameId,
        board: playerData.boardState,
      };
      const { data: aiMoveRes } = await aiMove(aiMovePayload);
      const aiData = aiMoveRes.data;
      setBoard(aiData.boardState);
      if (aiData.status === "ended") {
        setGameOver(true);
        setGameResult(aiData.result);
        setIsUserTurn(false);
        return;
      }
      setIsUserTurn(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async (userFirst) => {
    setLoading(true);
    setGameOver(false);
    setGameResult(null);
    try {
      const payload = {
        firstMoveBy: userFirst ? "user" : "ai",
        aiPlayer: userFirst ? "o" : "x",
        userPlayer: userFirst ? "x" : "o",
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
        if (aiData.status === "ended") {
          setGameOver(true);
          setGameResult(aiData.result);
          setIsUserTurn(false);
          return;
        }
        setIsUserTurn(true);
      }
    } catch (error) {
      toast.error(error.message);
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
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      {!gameStarted ? (
        <div className="flex flex-col items-center space-y-6">
          <Heading>Choose who plays first</Heading>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button onClick={() => startGame(true)} className="w-48" disabled={loading}>
              I'll go first
            </Button>
            <Button onClick={() => startGame(false)} className="w-48" disabled={loading}>
              Computer goes first
            </Button>
          </div>
          {loading && <div className="mt-4">Starting game...</div>}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-[280px]">
            <Heading className="text-2xl font-bold">{isUserTurn ? `Your turn (${userSymbol.toUpperCase()})` : `Computer's turn (${userSymbol == "x" ? "O" : "X"})`}</Heading>
          </div>

          <Board board={board} onCellClick={handleCellClick} isUserTurn={isUserTurn && !gameOver} />

          {gameOver && <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded text-lg font-bold text-yellow-800">Game Over: {gameResult}</div>}

          <div className="w-full flex justify-center">
            <Button onClick={resetGame}>New Game</Button>
          </div>
        </div>
      )}
    </div>
  );
}
