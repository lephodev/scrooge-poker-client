import axios from "axios";
import CryptoJS from "crypto-js";

export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const Encrypt = (cipher) => {
  const PUBLICK_KEY = "AC2d27e9ad2978d70ffb5637ce05542073";
  // Decrypt
  if (cipher) {
    const ciphercard = CryptoJS.AES.encrypt(cipher, PUBLICK_KEY).toString();
    return ciphercard;
  }
};

const getUtcTime = async () => {
  try {
      const response = await axios.get("https://worldtimeapi.org/api/timezone/Etc/UTC");
      return  response.data.utc_datetime;
      // const utcDatetimeStr = response.data.utc_datetime;
      // const utcDatetime = new Date(utcDatetimeStr);
      // return utcDatetime;
  } catch (error) {
      console.error("Error:", error.message);
      return null;
  }
}

export const validateToken = async () => {
  try {
    const utcTime = await getUtcTime();
    // const getPass = new Date().toISOString();
    const newDt = new Date(utcTime).getTime();
    const base64Credentials = btoa(`scr@@ze:${newDt}`);
    const crd = Encrypt(base64Credentials);
    const authHeader = `Basic ${crd}`;
    return authHeader;
  } catch (error) {
    console.log("error", error);
  }
};
