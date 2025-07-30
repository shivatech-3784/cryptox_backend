import { Router } from "express";

import { getUserWallet } from "../controllers/wallet.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/portfolio").get(verifyJWT,getUserWallet);

export default router;