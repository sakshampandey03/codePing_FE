import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://codeping-be.onrender.com/api/v1", // Or your production base URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
