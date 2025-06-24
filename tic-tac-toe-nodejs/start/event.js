const emailEvent = require("../events/email.event");
const statisticEvent = require("../events/statistic.event");

module.exports = function (eventEmitter) {
  emailEvent(eventEmitter);
  statisticEvent(eventEmitter);
};
