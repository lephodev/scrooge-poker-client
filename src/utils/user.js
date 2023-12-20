import axios from "axios";
import { getCookie, validateToken } from "./cookieUtil";
import CONSTANTS from "../config/contants";
// import { pokerInstance } from "./axios.config";

const basicAuthToken = validateToken();

// This function is alternative of firebase.auth().onAuthStateChanged
const getAuthUserData = async () => {
  console.log("getCookie", getCookie("token"));
  try {
    let userData = await axios({
      method: "get",
      url: `${CONSTANTS.landingServerUrl}/auth/check-auth`,
      headers: {
        Authorization: basicAuthToken,
      },
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
