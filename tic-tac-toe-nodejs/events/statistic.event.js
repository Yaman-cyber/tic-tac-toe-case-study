const handler = require("../handlers/statistic.handler");
const eventsNames = require("../constants/events.json");

module.exports = function (event) {
  event.on(eventsNames.statistic.incUsers, handler.increaseUsers);
};
