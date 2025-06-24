const { Statistic } = require("../models/statistics.model");
const moment = require("moment");

async function increaseUsers() {
  const currentDate = moment();

  // Get the current date as a formatted string (e.g., '2023-08-06')
  const formattedDate = currentDate.format("YYYY-MM-DD");

  const date = new Date(formattedDate);

  await Statistic.findOneAndUpdate(
    { date },
    { $inc: { users: 1 } },
    { new: true, upsert: true }
  );
}

module.exports = { increaseUsers };
