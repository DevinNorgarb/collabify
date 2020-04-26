import { axios, setAuthHeader, appModeVuex } from "boot/axios";

import EventBus from "assets/utils/EventBus";
var SpotifyWebApi = require("spotify-web-api-node");

import { log } from "assets/utils/app-utils";

export const login = async ({ commit, dispatch, getters, state }, payload) => {
  try {
    // const res = await axios.post(process.env.api + `/register`, payload);
    const res = await axios.post(
      "http://192.168.8.105:8000/api/register",
      payload
    );

    // if (res.data.users === 0) {
    //   return Promise.reject("Username or Password is incorrect.");
    // }

    commit(
      "commons/updateField",
      { path: "isAuth", value: true },
      { root: true }
    );
    commit("updateField", { path: "user", value: payload });
    commit("updateField", { path: "token", value: payload.accessToken });
    commit("updateField", {
      path: "refresh_token",
      value: payload.refreshToken
    });
    setAuthHeader(getters["getField"]("token"));
  } catch (e) {
    process.env.DEV && log(e);
    throw e;
  }
};

export const getLikedTracks = async (
  { commit, dispatch, getters, state },
  payload
) => {
  var spotifyApi = new SpotifyWebApi({
    accessToken: state.user.accessToken,
    refreshToken: state.user.refreshToken
  });

  // spotifyApi.setAccessToken(this.$store.state.spotifyAuth.user.accessToken);
  spotifyApi
    .getMySavedTracks({
      limit: payload.limit,
      offset: payload.offset
    })
    .then(
      function(data) {},
      function(err) {
        console.log("Something went wrong!", err);
      }
    );
};

export const search = async ({ commit, dispatch, getters, state }, payload) => {
  console.log(state);

  var spotifyApi = new SpotifyWebApi({
    accessToken: state.user.accessToken
  });

  console.log(payload);

  await spotifyApi.searchTracks(payload).then(
    function(data) {
      console.log(data.body);

      var tracks = Object.assign({}, data.body.tracks);

      // EventBus.$emit("search_tracks", tracks);

      commit("updateField", {
        path: "search_tracks",
        value: data.body.tracks
      });
      // commit("updateField", {
      //   path: "search_tracks",
      //   value: data
      // });
      // commit("updateField", {
      //   path: "search_tracks",
      //   value: data
      // });
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );

  // Search playlists whose name or description contains 'workout'
  spotifyApi.searchPlaylists("workout").then(
    function(data) {
      commit("updateField", {
        path: "search_playlists",
        value: data.body
      });
      console.log("Found playlists are", data.body);
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );

  //   spotifyApi
  //     .getMySavedTracks({
  //       limit: payload.limit,
  //       offset: payload.offset
  //     })
  //     .then(
  //       function(data) {
  //         console.log(data);

  //         commit("updateField", { path: "liked_tracks", value: data });
  //         commit("updateField", { path: "liked_tracks_limit", value: data });
  //         commit("updateField", { path: "liked_tracks_offset", value: data });
  //       },
  //       function(err) {
  //         console.log("Something went wrong!", err);
  //       }
  //     );
  return state;
};
