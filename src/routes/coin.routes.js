import { Router } from "express";

import { getAllCoins,
         getCoinDetails} from "../controllers/coin.controller.js";

const router = Router();

router.route("/AllCoins").get(getAllCoins);
router.route("/coin/:id").get(getCoinDetails)

export default router;
