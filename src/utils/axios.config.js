import axios from "axios";
import CONSTANTS from "../config/contants";
import { validateToken } from "./utils";
import { getCookie } from "./cookieUtil";

const getAuthorizationHeader = async () => {
  const basicAuthToken = await validateToken();
  return basicAuthToken;
};
export const userInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/users`,
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
  });
}


export const authInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/auth`,
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
  });
}
  

export const pokerInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${CONSTANTS.serverUrl}/poker`,
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
}
  
export const tournamentInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${CONSTANTS.serverUrl}/tournament`,
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
}
  
export const ticketTotokenInstance = () => axios.create({
  baseURL: `${CONSTANTS.marketServer}/api`,
  headers: {
    Authorization: getCookie("token") ? `Bearer ${getCookie("token")}` : "",
    "Permissions-Policy": "geolocation=*",
  },
  withCredentials: true,
  credentials: "include",
});
  
