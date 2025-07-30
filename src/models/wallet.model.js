import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  coinName: { type: String, required: true },
  quantity: { type: Number, required: true },
  averageBuyPrice: { type: Number, required: true },
  totalInvested: { type: Number, required: true }
}, { _id: false });

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    default: 0
  },
  invested: {
    type: Number,
    default: 0
  },
  coins: [coinSchema]
}, { timestamps: true });


export const Wallet = mongoose.model("Wallet", walletSchema);
