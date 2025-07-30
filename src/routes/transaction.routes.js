import { Router } from "express";

import { createTransaction,
         getUserTransactions} from "../controllers/transaction.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/transaction").post(verifyJWT,createTransaction);
router.route("/userTransaction").post(verifyJWT,getUserTransactions);

export default router;
