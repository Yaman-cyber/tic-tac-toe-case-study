const express = require("express");
const router = express.Router();
const api = require("../../../controllers/api/v1/game.controller");
const auth = require("../../../middlewares/auth/auth");

router.post("/start", auth, api.startGame);

router.post("/player-move", auth, api.playerMove);

router.post("/ai-move", auth, api.aiMove);

router.get("/", auth, api.getGames);

router.get("/:id", auth, api.getById);

module.exports = router;
