import express from "express";

import checkToken from "./middlewares/token.js";
import account from "./handlers/master/account.js";
import user from "./handlers/master/user.js";
import transaction from "./handlers/transaction/transaction.js";
const router = express.Router();
// router.get("/dashboard", dashboard.index);
router.post("/accounts/signup", user.createUser);
router.post("/accounts/login", user.login);
router.post("/payments/send", checkToken,transaction.send);
router.get("/accounts/:username/payment-accounts", checkToken,account.get);
export default router;
