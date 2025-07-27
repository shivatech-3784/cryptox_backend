import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler( async(req,res,next)=>{
    //req.header can give one user accesstoken which is in this format Authorization: Bearer <token> we are removing Bearer so that we can get Token
try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    
        if(!token){
           throw new ApiError(400,"Unauthorized access");
        }
        
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(400,"Unauthorized access");
        }
    
        req.user = user;
        next();
} catch (error) {
    throw new ApiError(401,error?.message ||"Invalid access")
}
})