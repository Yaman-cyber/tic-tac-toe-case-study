const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivatekey")) throw new Error("FATAL ERROR:jwtPrivatekey is not defined");

  if (!config.get("db")) throw new Error("FATAL ERROR:db is not defined");

  if (!config.get("environment")) throw new Error("FATAL ERROR:environment is not defined");

  if (!config.get("pythonAPI.url")) throw new Error("FATAL ERROR:pythonAPI.url is not defined");
};
