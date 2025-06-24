import axios from "../../axios";

const statisticsEndPoint = "/v1/statistics";

export interface StatisticsData {
  total: number;
  won: number;
  lost: number;
  draw: number;
}

export interface StatisticsResponse {
  data: StatisticsData;
  message: string;
  success: boolean;
  metadata?: object;
}

export async function gameStats() {
  const endpoint = `${statisticsEndPoint}/games`;
  return await axios.get<StatisticsResponse>(endpoint);
}
