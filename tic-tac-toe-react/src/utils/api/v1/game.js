import axios from "../../axios";

const statisticsEndPoint = "/v1/game";

export async function startGame({ firstMoveBy, aiPlayer, userPlayer }) {
  const endpoint = `${statisticsEndPoint}/start`;

  return await axios.post(endpoint, { firstMoveBy, aiPlayer, userPlayer });
}

export async function playerMove({ gameId, state, move }) {
  const endpoint = `${statisticsEndPoint}/player-move`;

  return await axios.post(endpoint, { gameId, state, move });
}

export async function aiMove({ gameId, board }) {
  const endpoint = `${statisticsEndPoint}/ai-move`;

  return await axios.post(endpoint, { gameId, board });
}
