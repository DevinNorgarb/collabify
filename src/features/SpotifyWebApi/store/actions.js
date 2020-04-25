import { axios, setAuthHeader, appModeVuex } from "boot/axios";

import { log } from "assets/utils/app-utils";

export const login = async ({ commit, dispatch, getters }, payload) => {
  try {
    console.log(getters);

    // const res = await axios.post(process.env.api + `/register`, payload);
    const res = await axios.post(
      "http://192.168.8.105:8000/api/register",
      payload
    );

    log("login res", res);

    // if (res.data.users === 0) {
    //   return Promise.reject("Username or Password is incorrect.");
    // }

    commit(
      "commons/updateField",
      { path: "isAuth", value: true },
      { root: true }
    );
    console.log(payload);
    commit("updateField", { path: "user", value: payload });
    commit("updateField", { path: "token", value: payload.accessToken });
    setAuthHeader(getters["getField"]("token"));
  } catch (e) {
    process.env.DEV && log(e);
    throw e;
  }
};
