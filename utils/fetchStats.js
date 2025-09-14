import { apiConnector } from "./apis";

export const fetchUserStats = async (email) => {

  try {
    const data = await apiConnector(
      "GET",
      "/stats",
      null,
      {},
      { email },                 // axios turns into ?email=...
      { withCredentials: false } // ✅ no cookies for public stats
    );

    if (!data.success) throw new Error("------------------Stats not found: ---------------" + data.message);
    return data.stats;
  } catch (error) {
    console.log("--------------------Error while fetching stats----------------------", error);
    throw error;
  }
};
