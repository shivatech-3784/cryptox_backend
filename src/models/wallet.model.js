import mongoose, { Schema } from "mongoose"

const walletSchema = new Schema(
    {
        UserId: {
            type: String,
            require: true,
        },
        Amount: {
            type: Number,
        },
        Invested: {
            type: Number,
        },
    }
    , { timestamps: true })

export const Wallet = mongoose.model("Wallet", walletSchema);