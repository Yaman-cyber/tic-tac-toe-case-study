const winston = require("winston");

const pythonClient = require("./client");

/**
 * Send player move to python engine
 * @param {object} payload
 * @param {object} payload.state - Current game state
 * @param {Array<Array<number>>} payload.state.board - 3x3 game board
 * @param {string} payload.state.current_player - Current player's turn ('x' or 'o')
 * @param {object} payload.move - The move coordinates
 * @param {number} payload.move.row - Row index (0-2)
 * @param {number} payload.move.col - Column index (0-2)
 * @returns {Promise<{success: boolean, response?: object, error?: string}>} Response object
 * @returns {object} response.board - Updated 3x3 game board
 * @returns {object|null} response.next_move - Next move coordinates or null
 * @returns {boolean} response.game_over - Whether the game is over
 * @returns {string|null} response.winner - Winner of the game ('x', 'o') or null
 * @returns {string} response.message - Status message
 */
module.exports = async function (payload) {
  try {
    const { data: response } = await pythonClient.post("/api/game/player-move", payload);

    return { success: true, response };
  } catch (error) {
    winston.error("python.playerMove.service", error);

    return { success: false, error: error?.response?.data?.detail };
  }
};
