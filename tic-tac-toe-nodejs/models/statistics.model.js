const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema({
  date: { type: Date, required: true },

  users: { type: Number, default: 0 },
});

const Statistic = mongoose.model("Statistic", statisticSchema);

exports.Statistic = Statistic;
