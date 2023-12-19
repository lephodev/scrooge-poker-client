import axios from "axios";
import CONSTANTS from "../config/contants";
import { validateToken } from "./utils";

const getAuthorizationHeader = () => {
  const basicAuthToken = validateToken();
  return basicAuthToken;
};
console.log("getAuthorizationHeader", getAuthorizationHeader());
export const userInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/users`,
    headers: {
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },
  });

export const authInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/auth`,
    headers: {
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },
  });

export const pokerInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}/poker`,
    headers: {
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
export const tournamentInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}/tournament`,
    headers: {
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
export const ticketTotokenInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.marketServer}/api`,
    headers: {
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
