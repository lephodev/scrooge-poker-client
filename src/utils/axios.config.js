import axios from "axios";
import CONSTANTS from "../config/contants";

const getAuthorizationHeader = () => `Bearer ${localStorage.getItem('token')}`;

export const userInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/v1/users`,
    headers: { Authorization: getAuthorizationHeader() },
  });