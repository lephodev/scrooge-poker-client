import axios from "axios";
import CONSTANTS from "../config/contants";

const getAuthorizationHeader = () => `Bearer ${localStorage.getItem('token')}`;

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