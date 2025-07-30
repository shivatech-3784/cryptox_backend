import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {Wallet} from "../models/wallet.model.js";

export const getUserWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user._id });

  if (!wallet || wallet.coins.length === 0) {
    throw new ApiError(404, "Wallet is empty");
  }

  // Filter out coins with negligible quantity
  wallet.coins = wallet.coins.filter((coin) => coin.quantity >= 1e-6);

  // If all coins were removed
  if (wallet.coins.length === 0) {
    throw new ApiError(404, "Wallet is empty");
  }

  await wallet.save(); // Save updated wallet

  return res
    .status(200)
    .json(new ApiResponse(200, wallet.coins, "Wallet data fetched"));
});
