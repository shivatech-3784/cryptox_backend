import { Router } from "express";
import {createUser,
        refreshAccessToken,
        loginUser,
        logoutUser} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refreshAccessToken").post(verifyJWT,refreshAccessToken)

export default router;