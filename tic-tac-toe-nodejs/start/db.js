const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  mongoose
    .connect(config.get("db"))
    .then(() => winston.info(`Connected to Database...`))
    .catch((err) => winston.error(`failed to connect to Database. an error occurred: ${err}`));
};
