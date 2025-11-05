// utils/cookie.js
import Cookies from "js-cookie";

export const setToken = (token) => {
  // Set token in cookie; you can add options like expires, secure, etc.
  //console.log("Set Token ", token);
  Cookies.set("authToken", token, { expires: 7 });
};

export const setMSoAuthToken = (msoauthtoken, expires_in) => {
  //console.log("Set MS oAuth Token ", msoauthtoken);
  Cookies.set("msoAuthToken", msoauthtoken, { expires: expires_in/86400 });
}

export const getToken = () => {
  const token = Cookies.get("authToken");
  //console.log("get Token is called", token);
  return token;
};

export const getMSoAuthToken = () => {
  const msoAuthToken = Cookies.get("msoAuthToken");
  return msoAuthToken;
}

export const removeToken = () => {
  Cookies.remove("authToken");
};
export const removeMSoAuthToken = () => {
  Cookies.remove("msoAuthToken");
};
