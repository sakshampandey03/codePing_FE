
import { auth, provider } from "./firebase.js";
import { signInWithPopup, signOut } from "firebase/auth";

const googlelogin = async () => {
  try {
    const response = await signInWithPopup(auth, provider);
    const user = response.user;
    const userData = {
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL,
    };
    // console.log(userData);

    // const apiResponse = await fetch("https://codeping-be.onrender.com/api/v1/login", {
    const apiResponse = await fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const apiResponseData = await apiResponse.json();
    // console.log("logging login api response ", apiResponseData)
    if (apiResponseData.success) {
      console.log("google login successful at googlelogin frontend", apiResponseData);
      return true;
    } else {
      throw new Error("Failed to login ");
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const googlelogout = async () => {
  try {
    await signOut(auth);
    console.log("google LogOut successful from firebase server");
    const response = await fetch("https://codeping-be.onrender.com/api/v1/logout", {
      method : "POST",
      credentials : "include"
    });
    if (!response.success) {
      console.log("error in logout api");
      // throw new Error("could not logout, broken logout api");
    }
    window.location.href = "/";
  } catch (error) {
    console.log("error in google logout frontend", error);
  }
};

export { googlelogin, googlelogout };
