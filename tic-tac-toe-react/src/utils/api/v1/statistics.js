import axios from "../../axios";

const statisticsEndPoint = "/v1/statistics";

export async function gameStats() {
  const endpoint = `${statisticsEndPoint}/games`;

  return await axios.get(endpoint);
}
