import React, { useEffect, useState } from "react";

import StatCard from "./components/StatCard";
import { gameStats } from "../../utils/api/v1/statistics";

export default function StatisticsView() {
  const [data, setData] = useState({
    total: 0,
    won: 0,
    lost: 0,
    draw: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await gameStats();

        setData(data.data);
      } catch (error) {
        setData({ total: 0, won: 0, lost: 0, draw: 0 });
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-8">Game Statistics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Games" value={data.total} color="border-l-4 border-blue-500" />
          <StatCard title="Wins" value={data.won} color="border-l-4 border-green-500" />
          <StatCard title="Losses" value={data.lost} color="border-l-4 border-red-500" />
          <StatCard title="Draws" value={data.draw} color="border-l-4 border-yellow-500" />
        </div>
      </div>
    </div>
  );
}
