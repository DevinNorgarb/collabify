import { axios, setAuthHeader, appModeVuex } from "boot/axios";

import { initListeners } from "assets/utils/websocket/socket";

import EventBus from "assets/utils/EventBus";
var SpotifyWebApi = require("spotify-web-api-node");

export const login = async ({ commit, dispatch, getters, state }, payload) => {
  try {
    // const res = await axios.post(process.env.api + `/register`, payload);
    const res = await axios.post(
      "http://192.168.8.105:8000/api/register",
      payload
    );

    commit(
      "commons/updateField",
      { path: "isAuth", value: true },
      { root: true }
    );
    initListeners(payload.accessToken);

    commit("updateField", { path: "user", value: payload });
    commit("updateField", { path: "token", value: payload.accessToken });
    commit("updateField", {
      path: "refresh_token",
      value: payload.refreshToken
    });
    setAuthHeader(getters["getField"]("token"));
  } catch (e) {}
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
  var spotifyApi = new SpotifyWebApi({
    accessToken: state.user.accessToken
  });

  console.log(payload);

  await spotifyApi.search(payload.term, ["track"], payload).then(
    function(data) {
      var tracks = Object.assign({}, data.body.tracks);
      var pagination = Object.assign({}, data.body.tracks);
      console.log(data.body);

      commit("updateField", {
        path: "search_tracks",
        value: data.body.tracks
      });
      commit("updateField", {
        path: "search_tracks_pagination",
        value: {
          total: pagination.total,
          limit: pagination.limit,
          offset: pagination.offset
        }
      });
    },
    function(err) {
      dispatch("getToken");
    }
  );
  return state;
};

export const getToken = async ({ commit, dispatch, getters, state }) => {
  useInAppBrowser(dispatch);
};

export const playTrack = async ({ commit, dispatch, getters }) => {
  // useInAppBrowser(dispatch);

  EventBus.$emit(`socket-update:play_track`, {
    action: "play_track",
    payload: {
      data: data,
      context: { uri: data.context, offset: data.offset }
    }
  });
};

/*



































**/
function useInAppBrowser(dispatch) {
  var authorizeURL = `http://192.168.8.105:8888/auth/spotify`;
  var endUrl = "http://192.168.8.105:8080";
  var browser = cordova.InAppBrowser.open(
    authorizeURL,
    "_blank",
    "location=no",
    "hidden=yes"
  );
  browser.hide();

  browser.addEventListener("loadstop", evt => {});
  browser.addEventListener("loaderror", evt => {
    browser.close();
  });

  browser.addEventListener("loadstart", evt => {
    var url_string = evt.url;
    var url = new URL(url_string);
    var params = parse_query_string(url.search);

    if (evt.url.includes(endUrl)) {
      browser.close();
      var user = params;

      user.name = user.displayName;
      var rawData = JSON.parse(user._raw);
      user.email = rawData.email;

      dispatch("login", user);
      initListeners(user.accessToken);

      console.log(user);
    }
  });
}

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}
