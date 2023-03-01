import axios from "axios";
// import { pokerInstance } from "./axios.config";

// This function is alternative of firebase.auth().onAuthStateChanged
const getAuthUserData = async () => {
  try {
    let userData = await axios({
      method: "get",
      url: "https://api.scrooge.casino/v1/auth/check-auth",
      headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true,
      credentials: "include",
    });

    return { success: true, data: userData.data };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

const userUtils = {
  getAuthUserData,
};

export default userUtils;
