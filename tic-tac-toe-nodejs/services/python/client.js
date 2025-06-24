const config = require("config");
const axios = require("axios");

const pythonClient = axios.create({ baseURL: config.get("pythonAPI.url") });

module.exports = pythonClient;
