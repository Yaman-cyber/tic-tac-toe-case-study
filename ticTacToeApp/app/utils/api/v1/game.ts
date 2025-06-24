import axios from "../../axios";

const statisticsEndPoint = "/v1/game";

export interface GameData {
  user: string;
  firstMoveBy: "ai" | "user";
  aiPlayer: "x" | "o";
  userPlayer: "x" | "o";
  status: "active" | "completed" | string;
  result: string | null;
  boardState: number[][];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GamesResponse {
  data: GameData;
  message: string;
  success: boolean;
  metadata?: object;
}

export interface StartGameParams {
  firstMoveBy: "ai" | "user";
  aiPlayer: "x" | "o";
  userPlayer: "x" | "o";
}

export interface AiMoveParams {
  gameId: string;
  board: number[][];
}

export interface PlayerMoveParams {
  gameId: string;
  state: { board: number[][] };
  move: { row: number; col: number };
}

export async function startGame({ firstMoveBy, aiPlayer, userPlayer }: StartGameParams) {
  const endpoint = `${statisticsEndPoint}/start`;

  return await axios.post(endpoint, { firstMoveBy, aiPlayer, userPlayer });
}

export async function playerMove({ gameId, state, move }: PlayerMoveParams) {
  const endpoint = `${statisticsEndPoint}/player-move`;

  return await axios.post(endpoint, { gameId, state, move });
}

export async function aiMove({ gameId, board }: AiMoveParams) {
  const endpoint = `${statisticsEndPoint}/ai-move`;

  return await axios.post(endpoint, { gameId, board });
}
