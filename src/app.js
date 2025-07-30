import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: '30mb'}))
app.use(express.urlencoded({extended:true,limit:'30mb'}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"
import coinRouter from "./routes/coin.routes.js"
import wallerRouter from "./routes/wallet.routes.js"
import transactionRouter from "./routes/transaction.routes.js"


//routes declaration

app.use("/cryptoX/api/v1/users",userRouter)
app.use("/cryptoX/api/v1/coins",coinRouter)
app.use("/cryptoX/api/v1/wallet",wallerRouter)
app.use("/cryptoX/api/v1/transactions",transactionRouter)   

// in this way routes will form 
// http://localhost:8000/cryptoX/api/v1/users/create

export {app} ;