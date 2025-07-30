import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

 const getAllCoins = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
      },
    });
    return res.status(200).json(new ApiResponse(200, response.data, "Coins fetched"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch coins from external API");
  }
});

 const getCoinDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    return res.status(200).json(new ApiResponse(200, response.data, "Coin detail fetched"));
  } catch (error) {
    throw new ApiError(404, "Coin not found");
  }
});

export {getAllCoins,
        getCoinDetails}
