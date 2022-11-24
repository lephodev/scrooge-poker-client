import axios from 'axios';
import CONSTANTS from '../config/contants';
import { getCookie } from './cookieUtil';

const getAuthorizationHeader = () =>
  `Bearer ${localStorage.getItem('token') || getCookie('token')}`;

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
