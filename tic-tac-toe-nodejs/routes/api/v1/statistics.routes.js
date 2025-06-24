const express = require("express");
const router = express.Router();
const api = require("../../../controllers/api/v1/statistics.controller");
const auth = require("../../../middlewares/auth/auth");

router.get("/games", auth, api.getGamesStats);

module.exports = router;
