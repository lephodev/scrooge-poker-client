import axios from "axios";
import CONSTANTS from "../config/contants";
import { getCookie } from "./cookieUtil";

const getAuthorizationHeader = () => `Bearer ${getCookie("token")}` || `Bearer ${localStorage.getItem('token')}`;
export const userInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/users`,
    headers: { Authorization: getAuthorizationHeader() },
  });

export const authInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/auth`,
    headers: { Authorization: getAuthorizationHeader() },
  });

export const pokerInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}/poker`,
    headers: { Authorization: getAuthorizationHeader() },
  });
export const tournamentInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}/tournament`,
    headers: { Authorization: getAuthorizationHeader() },
  });
  export const ticketTotokenInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.marketServer}/api`,
    headers: {
      Authorization: getCookie('token') ? `Bearer ${getCookie('token')}` : '',
    },
  });
