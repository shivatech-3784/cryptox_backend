import { Router } from "express";
import {createUser,
        refreshAccessToken,
        loginUser,
        logoutUser,
        changeCurrentPassword,
        updateAccountDetails} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-Token").post(verifyJWT,refreshAccessToken)
router.route("/update-password").post(verifyJWT,changeCurrentPassword)
router.route("/update-details").patch(verifyJWT,updateAccountDetails)

export default router;