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

export const validateToken = () => {
  try {
    const getPass = new Date().toISOString();
    const newDt = new Date(getPass).getTime();
    const base64Credentials = btoa(`scr@@ze:${newDt}`);
    const crd = Encrypt(base64Credentials);
    const authHeader = `Basic ${crd}`;
    return authHeader;
  } catch (error) {
    console.log("error", error);
  }
};
