import axios from "axios";
import { Transaction } from "../models/transaction.model.js";
import { Wallet } from "../models/wallet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createTransaction = asyncHandler(async (req, res) => {
  const { type, coinId, coinName, amount } = req.body;
  const userId = req.user._id;

  if (!type || !coinId || !coinName || !amount) {
    throw new ApiError(400, "All transaction fields are required");
  }

  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than zero");
  }

  // 🔁 Fetch full coin data from CoinGecko
  const coinData = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);

  const price = coinData.data?.market_data?.current_price?.usd;
  const img = coinData.data?.image?.small;

  if (!price || typeof price !== "number") {
    throw new ApiError(500, "Failed to fetch valid coin price");
  }

  const quantity = parseFloat((amount / price).toFixed(8));

  // ✅ Now use 'img' while creating transaction
  const transaction = await Transaction.create({
    userId,
    type,
    coinId,
    coinName,
    price,
    quantity,
    amount,
    img
  });

  // Wallet logic (same as before)
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId, coins: [] });
  }

  let coin = wallet.coins.find((c) => c.coinId === coinId);

  if (type === "buy") {
    if (coin) {
      coin.quantity += quantity;
      coin.totalInvested += amount;
      coin.averageBuyPrice = coin.totalInvested / coin.quantity;
    } else {
      wallet.coins.push({
        coinId,
        coinName,
        quantity,
        averageBuyPrice: price,
        totalInvested: amount
      });
    }
  } else if (type === "sell") {
    if (!coin || coin.quantity < quantity) {
      throw new ApiError(400, "Not enough coins to sell");
    }

    coin.quantity -= quantity;
    coin.totalInvested -= quantity * coin.averageBuyPrice;

    if (coin.quantity === 0) {
      wallet.coins = wallet.coins.filter((c) => c.coinId !== coinId);
    }
  } else {
    throw new ApiError(400, "Invalid transaction type");
  }

  await wallet.save();

  return res.status(201).json(new ApiResponse(201, transaction, "Transaction successful"));
});


const getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

  if (!transactions.length) {
    throw new ApiError(404, "No transactions found");
  }

  return res.status(200).json(new ApiResponse(200, transactions, "User transactions fetched"));
});

export {
  createTransaction,
  getUserTransactions
};
