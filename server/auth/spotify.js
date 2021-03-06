/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const passport = require('passport')
const { User } = require('../db/models')

//me trying something
const router = express.Router()

const SpotifyStrategy = require('passport-spotify').Strategy;



if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.log('Spotify client ID / secret not found. Skipping Spotify OAuth')
} else {
  const spotifyConfig = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_REDIRECT_URI
  }

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */

  passport.use(
    new SpotifyStrategy(
      {
        clientID: spotifyConfig.clientId,
        clientSecret: spotifyConfig.clientSecret,
        callbackURL: spotifyConfig.callbackURL
      },
      function (accessToken, refreshToken, expires_in, profile, done) {
        console.log(profile)
        // User.findOrCreate({
        //   where: { spotifyId: profile.id },
        //   defaults: {
        //     email: profile.emails[0].value,
        //     name: profile.displayName,
        //     spotifyId: profile.id,
        //     accessToken: accessToken,
        //     proPic: profile.photos[0],
        //     refreshToken: refreshToken
        //   }
        // })
        // .spread(function (user) {
        //   console.log('MAKING USER:', user)
        //   done(null, user)
        // })
        // .catch(done)
        User.findOne({ where: { spotifyId: profile.id } })
          .then(function (obj) {
            if (obj) {
              return obj.update({ accessToken, refreshToken })
            } else {
              return User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                spotifyId: profile.id,
                accessToken: accessToken,
                proPic: profile.photos[0],
                refreshToken: refreshToken
              })
            }
          })
          .then(function (user) {
            console.log('MAKING USER:', user)
            done(null, user)
          })
          .catch(done)
      }
    )
  );

  var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  var stateKey = 'spotify_auth_state';

  // var app = express();

  // app.use(express.static(__dirname + '/public'))
  //   .use(cors())
  //   .use(cookieParser());

  router.get('/', passport.authenticate('spotify', {
    // scope: ['user-read-email', 'user-read-private']
    scope: ["streaming", "user-read-birthdate", "user-read-email", "user-read-private"]
  }), function (req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

  router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  }
  );

  router.get('/login', function (req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: spotifyConfig.clientId,
        scope: scope,
        redirect_uri: spotifyConfig.callbackURL,
        state: state
      }));
  });

  // router.get('/callback', function (req, res) {

  //   // your application requests refresh and access tokens
  //   // after checking the state parameter

  //   var code = req.query.code || null;
  //   var state = req.query.state || null;
  //   var storedState = req.cookies ? req.cookies[stateKey] : null;

  //   if (state === null || state !== storedState) {
  //     res.redirect('/#' +
  //       querystring.stringify({
  //         error: 'state_mismatch'
  //       }));
  //   } else {
  //     res.clearCookie(stateKey);
  //     var authOptions = {
  //       url: 'https://accounts.spotify.com/api/token',
  //       form: {
  //         code: code,
  //         redirect_uri: redirect_uri,
  //         grant_type: 'authorization_code'
  //       },
  //       headers: {
  //         'Authorization': 'Basic ' + (new Buffer(spotifyConfig.clientId + ':' + spotifyConfig.clientSecret).toString('base64'))
  //       },
  //       json: true
  //     };

  //     request.post(authOptions, function (error, response, body) {
  //       if (!error && response.statusCode === 200) {

  //         var access_token = body.access_token,
  //           refresh_token = body.refresh_token;

  //         var options = {
  //           url: 'https://api.spotify.com/v1/me',
  //           headers: { 'Authorization': 'Bearer ' + access_token },
  //           json: true
  //         };

  //         // use the access token to access the Spotify Web API
  //         request.get(options, function (error, response, body) {
  //           console.log(body);
  //         });

  //         // we can also pass the token to the browser to make requests from there
  //         res.redirect('/#' +
  //           querystring.stringify({
  //             access_token: access_token,
  //             refresh_token: refresh_token
  //           }));
  //       } else {
  //         res.redirect('/#' +
  //           querystring.stringify({
  //             error: 'invalid_token'
  //           }));
  //       }
  //     });
  //   }
  // });

  router.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(spotifyConfig.clientId + ':' + spotifyConfig.clientSecret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });
}

module.exports = router

