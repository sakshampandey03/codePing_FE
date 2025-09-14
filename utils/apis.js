import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://codeping-be.onrender.com/api/v1",
  // baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // default for private routes
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {},
  extraConfig = {}
) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,
      params,
      ...extraConfig, // override if needed
    });
    return response.data; // ✅ axios already parses JSON
  } catch (error) {
    console.error("--------------------API error in apis.js:--------------------------------", error);
    throw error;
  }
};
