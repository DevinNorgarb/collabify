import { axios, setAuthHeader, appModeVuex } from "boot/axios";

import { log } from "assets/utils/app-utils";
import hello from "hellojs";

export const login = async ({ commit, dispatch, getters }, payload) => {
  try {
    log("login action", payload);

    // const oauthRes = await oauthLogin
    // const oauthRes = await oauthLogin
    // const oauthRes = await dispatch("oauthLogin", "spotify");

    // log(oauthRes);

    const res = await axios.post("/login", payload);

    log("login res", res);

    if (res.data.users === 0) {
      return Promise.reject("Username or Password is incorrect.");
    }
    const finRes = await dispatch("mockLogin", payload);
    log("final", finRes);
    commit(
      "commons/updateField",
      { path: "isAuth", value: true },
      { root: true }
    );
    commit("updateField", { path: "token", value: res.data.data.token });
    setAuthHeader(getters["getField"]("token"));
  } catch (e) {
    process.env.DEV && log(e);
    throw e;
  }
};

export const register = async ({ commit, dispatch, getters }, payload) => {
  try {
    // log("login action", payload);
    const res = await axios.post("/register", payload);
    log("login res", res);
  } catch (e) {
    process.env.DEV && log(e);
    throw e;
  }
};

export const oauthLogin = async ({ commit, dispatch, getters }, payload) => {
  var SPOTIFY_CLIENT_ID = "4fcf1eee54994be6a3f87183e80d4943";

  console.log(SPOTIFY_CLIENT_ID);

  try {
    // log("login action", payload);
    const res = await axios.post("/register", payload);
    log("login res", res);
  } catch (e) {
    process.env.DEV && log(e);
    throw e;
  }

  hello.login("auth.login", payload => {
    // Get Profile
    console.log(payload);

    console.log("auth.login");
    var hi = hello(payload);
    hi.api("me").then(payload => {
      console.log(payload);

      // document.getElementById(payload).innerHTML = "<img src='"+ p.thumbnail + "' width=24/>Connected to "+ r.network+" as " + p.name;
    });
  });
  // console.log(hello("spotify"));

  console.log(
    appModeVuex(process.env.DEV ? "redirect_uri" : "redirect_uri_prod")
  );

  hello("spotify").init(
    {
      spotify: SPOTIFY_CLIENT_ID
    },
    {
      redirect_uri: appModeVuex(
        process.env.DEV ? "redirect_uri" : "redirect_uri_prod"
      ),
      scope:
        "user-read-private,user-read-email,playlist-read-collaborative,playlist-modify-private,playlist-modify-public,playlist-read-private,user-modify-playback-state,user-read-playback-state,user-read-currently-playing,user-library-modify,user-library-read,user-follow-modify,user-follow-read,user-read-recently-played,user-top-read,streaming,app-remote-control",
      oauth_proxy: "https://auth-server.herokuapp.com/proxy"
    }
  );

  // hello.login({})

  //   hi.login().then(function() {
  //   alert('You are signed in to Facebook');
  // }, function(e) {
  //   alert('Signin error: ' + e.error.message);
  // });

  // hello.login().then(() => {
  //   const authRes = hello.getAuthResponse();
  //  console.log(authRes);

  //   /*

  //     performs operations using the token from authRes
  //   */
  //  hello.api('me').then(function (json) {
  //     const profile = json;
  //     console.log(profile);

  //     /*
  //       performs operations using the user info from profile
  //     */
  //   });
  // })

  // try {
  //   log('login action', payload)
  //   const res = await axios.post('/register', payload)
  //   log('login res', res)
  // } catch (e) {
  //   process.env.DEV && log(e)
  //   throw e
  // }
};
