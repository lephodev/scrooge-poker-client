import CryptoJS from "crypto-js";
import { PUBLICK_KEY } from "../config/keys";

const numFormatter = (num) => {
  if (num > 1 && num < 999) {
    return (num / 1)?.toFixed(0); // convert to K for number from > 1000 < 1 million
  } else if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(2) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(2) + "M"; // convert to M for number from > 1 million
  } else if (num >= 100000000 && num < 1000000000000) {
    return (num / 100000000).toFixed(2) + "B";
  } else if (num >= 1000000000000)
    return (num / 1000000000000).toFixed(2) + "T";
  else return num; // if value < 1000, nothing to do
};

export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const getTime = (time) => {
  let d = new Date(time);
  let pm = d.getHours() >= 12;
  let hour12 = d.getHours() % 12;
  if (!hour12) hour12 += 12;
  let minute = d.getMinutes();
  let date = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  return `${date}-${month}-${year} ${hour12}:${minute} ${pm ? "pm" : "am"}`;
};

export const DecryptCard = (cipher) => {
  // Decrypt

  if (cipher) {
    let cardBytes = CryptoJS.AES.decrypt(cipher, PUBLICK_KEY);
    return cardBytes.toString(CryptoJS.enc.Utf8);
    // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log({ decryptedData }); // [{id: 1}, {id: 2}]
    // return ;
  }
};
export default numFormatter;

function getMonthName(month) {
  const d = new Date();
  d.setMonth(month - 1);
  const monthName = d.toLocaleString("default", { month: "long" });
  return monthName?.substring(0,3);
}


export const dateFormat = (d = new Date()) => {
  const date = new Date(d);
  const day = date.getDate(); // Date of the month: 2 in our example
  let month = date.getMonth(); // Month of the Year: 0-based index, so 1 in our example
  const year = date.getFullYear(); // Year: 2013
  //const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  //const dayofweek = weekday[date.getDay()];
  month = getMonthName(month);
  return `${day} ${month} ${year}`;
};

export const timeFormat = (date = new Date()) => {
  let dateChange = date ? new Date(date) : new Date();
  let time = dateChange.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return time;
};


