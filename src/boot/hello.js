const HelloJs = require("hellojs");
const VueHello = require("vue-hellojs");
import { appModeVuex } from "./axios";

// HelloJs.init({
//   google: GOOGLE_APP_CLIENT_ID,
// facebook: FACEBOOK_APP_CLIENT_ID;
// }, {
//   redirect_uri: 'authcallback/'
// });

export default ({ Vue }) => {
  var SPOTIFY_CLIENT_ID = "4fcf1eee54994be6a3f87183e80d4943";
  HelloJs.init(
    {
      spotify: SPOTIFY_CLIENT_ID
    },
    {
      redirect_uri: "http://192.168.8.105:8080/#/"
      //   oauth_proxy: "https://auth-server.hserokuapp.com/proxy"
    }
  );
  // Set i18n instance on app
  Vue.use(VueHello, HelloJs);
};

//   export { i18n }
