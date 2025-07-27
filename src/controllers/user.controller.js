import { User } from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';


const generateAccessAndRefreshTokens = async(userId) =>{
    try {
       const user =await User.findById(userId);
       const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();
       user.refreshToken = refreshToken;
       await user.save({validateBeforeSave:false})
       return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating the access and refresh token")
    }
}

const createUser = asyncHandler(async (req, res) => {
    const {username,fullname,email,password,mob,age} = req.body;

    if([username,fullname,email,password,mob,age].some((field) =>field?.trim()==="")){
        
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(400,"User with email or username already exists kindly login");
    }
    
      const user = await User.create({
        fullname,
        email, 
        password,
        username: username.toLowerCase(),
        mob,
        age
     })

    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    if(!createdUser){
        throw new ApiError(400, "Something went wrong while creating user")
    }

     return res.status(201).json(
        new ApiResponse(200, createdUser, "User created Successfully")
    )
})

const loginUser = asyncHandler(async (req,res)=>{
     const {username,email,password} = req.body;

     if(!username && !email){
        throw new ApiError(400,"username or email is required")
     }

     const user = await User.findOne({
        $or: [{username},{email}]
     })

     if(!user){
        throw new ApiError(400,"User with email or username not exist kindly Signup")
     }

     const isPasswordvalid = await user.isPasswordCorrect(password);

     if(!isPasswordvalid){
        throw new ApiError(400,"Invalid Password credentials")
     }

     const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

     const options = {
        httpOnly: true,
        secure: true
     }

     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
     )
})

const logoutUser = asyncHandler (async (req, res)=>{
     User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken:undefined}
        },
        {
            new:true
        },
    )
        const options = {
        httpOnly: true,
        secure: true
        }

    return await res
        .status(201)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {
                },
                "user loggedout sucessfully!!"
            )
        )
})
// actually access token is short lived and refresh token is long lived when user logged in the site as long as he using that site the access token time will complete server tells user to relogin again inorder to get ridoff this situation we use refreshToken where it clicks a point where it regenerate access token to avoid relogging 

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const incomingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(400,"Unauthorized access")
    }
    try {
        
        const decodedtoken = verifyJWT(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

        if(!decodedtoken){
            throw new ApiError(400,"unauthorizedaccess")
        }

        const user = await User.findById(decodedtoken?._id);
        if(!user){
            throw new ApiError(400,"Invalid refresh Token");
        }

        const options ={
            httpOnly: true,
            secure:true
        }
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                     accessToken, refreshToken: newRefreshToken 
                }
                , "Access Token refreshed"
            )
        )

    } catch (error) {
       throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }
})

export {createUser,loginUser,logoutUser,refreshAccessToken}