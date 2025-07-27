import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
    {
        img: {
            type: String,
            require: true
        },
        CoinId: { 
            type: String,
            require: true
        },
        CoinName: { 
            type: String, 
            require: true
        },
        Quantity: { 
            type: Number, 
            require: true 
        },
        Amount: { 
            type: Number, 
            require: true 
        },
        Price: { 
            type: Number, 
            require: true 
        },
        Date: { 
            type: String 
        },
        type: { 
            type: String 
        },
    }
    , { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);