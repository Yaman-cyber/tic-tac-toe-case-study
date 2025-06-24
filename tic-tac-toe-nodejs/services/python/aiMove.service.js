const winston = require("winston");

const pythonClient = require("./client");

/**
 * Get ai move from python engine
 * @param {object} payload
 * @param {Array<Array<number>>} payload.board - 3x3 game board
 * @param {string} payload.current_player - Current player's turn ('x' or 'o')
 * @returns {Promise<{success: boolean, response?: object, error?: string}>} Response object
 * @returns {object} response.board - Updated 3x3 game board
 * @returns {object|null} response.next_move - Next move coordinates or null
 * @returns {boolean} response.game_over - Whether the game is over
 * @returns {string|null} response.winner - Winner of the game ('x', 'o') or null
 * @returns {string} response.message - Status message
 */
module.exports = async function (payload) {
  try {
    const { data: response } = await pythonClient.post("/api/game/ai-move", payload);

    return { success: true, response };
  } catch (error) {
    winston.error("python.aiMove.service", error);

    return { success: false, error: error?.response?.data?.detail };
  }
};
