import { axios, setAuthHeader, appModeVuex }  from 'boot/axios'

import { log } from 'assets/utils/app-utils'
import hello from "hellojs";



export const login = async ({ commit, dispatch, getters }, payload) => {
  try {
    log('login action', payload)

    // const oauthRes = await oauthLogin
    // const oauthRes = await oauthLogin
        const oauthRes = await oauthLogin('oauthLogin', payload)


        console.log(oauthRes);

    // const res = await axios.post('/login', payload)

    // log('login res', res)


    // if (res.data.users === 0) {
    //   return Promise.reject('Username or Password is incorrect.')
    // }
    // const finRes = await dispatch('mockLogin', payload)
    // log('final', finRes)
    // commit('commons/updateField', { path: 'isAuth', value: true }, { root: true })
    // commit('updateField', { path: 'token', value: res.data.data.token })
    // setAuthHeader(getters['getField']('token'))
  } catch (e) {
    process.env.DEV && log(e)
    throw e
  }
}

export const register = async ({ commit, dispatch, getters }, payload) => {
  try {


    log('login action', payload)
    const res = await axios.post('/register', payload)
    log('login res', res)
  } catch (e) {
    process.env.DEV && log(e)
    throw e
  }
}


export const oauthLogin = async ({ commit, dispatch, getters }, payload) => {

  var SPOTIFY_CLIENT_ID = "4fcf1eee54994be6a3f87183e80d4943";

    hello.init(
      {
        spotify: SPOTIFY_CLIENT_ID
      },
      {
        redirect_uri: appModeVuex(process.env.DEV ? 'redirect_uri' : 'redirect_uri_prod'),
        oauth_proxy: "https://auth-server.herokuapp.com/proxy"

      }
      );

      // hello.login({})



    hello('spotify').login({scope:  "user-read-private,user-read-email,playlist-read-collaborative,playlist-modify-private,playlist-modify-public,playlist-read-private,user-modify-playback-state,user-read-playback-state,user-read-currently-playing,user-library-modify,user-library-read,user-follow-modify,user-follow-read,user-read-recently-played,user-top-read,streaming,app-remote-control"}).then(function() {
      alert('You are signed in to Facebook');
    }, function(e) {
      alert('Signin error: ' + e.error.message);
    });



    hello("spotify").login().then(() => {
      const authRes = hello("spotify").getAuthResponse();
     console.log(authRes);

      /*

        performs operations using the token from authRes
      */
      hello('spotify').api('me').then(function (json) {
        const profile = json;
        console.log(profile);

        /*
          performs operations using the user info from profile
        */
      });
    })

  // try {
  //   log('login action', payload)
  //   const res = await axios.post('/register', payload)
  //   log('login res', res)
  // } catch (e) {
  //   process.env.DEV && log(e)
  //   throw e
  // }
}
