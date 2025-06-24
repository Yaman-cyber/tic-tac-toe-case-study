const express = require("express");
const router = express.Router();
const api = require("../../../controllers/api/v1/auth.controller");
const auth = require("../../../middlewares/auth/auth");

router.post("/login", api.logIn);

router.post("/signup", api.signup);

router.post("/verify", api.verify);

router.post("/request-code", api.requestCode);

router.post("/reset-password", api.resetPassword);

router.get("/auto-login", auth, api.autoLogin);

router.post("/log-out", auth, api.logOut);

module.exports = router;
