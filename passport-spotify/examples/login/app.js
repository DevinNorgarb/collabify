var express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  // swig = require("swig"),
  SpotifyStrategy = require("../../lib/passport-spotify/index").Strategy;

// var consolidate = require("consolidate");
var cors = require("cors");
const bodyParser = require("body-parser");

var axios = require("axios");
var SpotifyWebApi = require("spotify-web-api-node");

var appKey = "4fcf1eee54994be6a3f87183e80d4943";
var appSecret = "203f38db980246d78aee9b1eb1b16aea";

var spotifyApi = new SpotifyWebApi();

const querystring = require("querystring");

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  // console.log(user);

  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var accessToken = "";
var refreshToken = "";
var expiresIn = "";
var profile = "";

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, expires_in
//   and spotify profile), and invoke a callback with a user object.
passport.use(
  new SpotifyStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: "http://192.168.8.105:8888/callback"
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        // return profile;

        // console.log();
        accessToken = accessToken;
        expires_in;
        refreshToken = refreshToken;
        expiresIn = expires_in;

        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.expires_in = expiresIn;

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);
        spotifyApi.setRedirectURI("http://192.168.8.105:8888/callback");
        spotifyApi.setClientId(appKey);
        spotifyApi.setClientSecret(appSecret);

        return done(null, profile);
      });
    }
  )
);

var app = express();
app.use(cors());

// // configure Express
// app.set("views", __dirname + "/views");
// app.set("view engine", "ejs");

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(__dirname + "/public"));

// // app.engine("html", consolidate.swig);

app.get("/", function(req, res) {
  return res.redirect(`http://192.168.8.105:8080/#/home?user=${req.user}`);

  // res.render("index.html", { user: req.user });
});

app.get("/account", ensureAuthenticated, function(req, res) {
  // res.render("account.html", { user: req.user });
});

app.get("/login", function(req, res) {
  // res.render("login.html", { user: req.user });
});

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: [
      "user-read-private",
      "user-read-email",
      "playlist-read-collaborative",
      "playlist-modify-private",
      "playlist-modify-public",
      "playlist-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-library-modify",
      "user-library-read",
      "user-follow-modify",
      "user-follow-read",
      "user-read-recently-played",
      "user-top-read",
      "streaming",
      "app-remote-control"
    ]
    // showDialog: true,
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  "/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  function(req, res) {
    const query = querystring.stringify(req.user);

    return res.redirect(`http://192.168.8.105:8080/home?user=${query}`);
  }
);

app.get(
  "/refresh",

  function(req, res) {
    // console.log(req.accessToken);
    const query = querystring.stringify(req.user);

    console.log(req.body);
    console.log(req.params.refreshToken);
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    spotifyApi.setRedirectURI("http://192.168.8.105:8888/callback");
    spotifyApi.setClientId(appKey);
    spotifyApi.setClientSecret(appSecret);

    // console.log(req.body);

    // console.log(req);
    // console.log(req, res, spotifyApi);

    spotifyApi.refreshAccessToken().then(
      function(data) {
        console.log(data);

        // tokenExpirationEpoch =
        //   new Date().getTime() / 1000 + data.body['expires_in'];
        // console.log(
        //   'Refreshed token. It now expires in ' +
        //     Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
        //     ' seconds!'
        // );
      },
      function(err) {
        console.log("Could not refresh the token!", err.message);
      }
    );
    // console.log(req.user);

    // backURL = req.header("Referer") || "/";
    // // do your thang
    // res.redirect(backURL);

    // return res.redirect(`http://192.168.8.105:8080/home?user=${query}`);
  }
);

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(8888);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// const SpotifyStrategy = require('passport-spotify').Strategy;

// passport.use(
//   new SpotifyStrategy(
//     {
//       clientID: appKey,
//       clientSecret: appSecret,
//       callbackURL: 'http://192.168.8.105:8888/auth/spotify/callback'
//     },
//     function(accessToken, refreshToken, expires_in, profile, done) {
//       User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
//         return done(err, user);
//       });
//     }
//   )
// );
