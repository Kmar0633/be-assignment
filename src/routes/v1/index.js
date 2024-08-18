import express from "express";

import checkToken from "./middlewares/token.js";

import user from "./handlers/master/user.js";

const router = express.Router();
// router.get("/dashboard", dashboard.index);
router.post("/accounts/signup", user.createUser);
router.post("/accounts/login", user.login);

export default router;
