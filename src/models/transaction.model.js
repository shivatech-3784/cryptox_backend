import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true
    },
    coinId: {
      type: String,
      required: true
    },
    coinName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction",transactionSchema);