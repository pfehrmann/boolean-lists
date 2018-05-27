let env = require('dotenv').config();
let SpotifyWebApi = require('spotify-web-api-node');
let opn = require('opn');

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

let scopes = ['user-read-private', 'user-read-email'];
let state = 'random-state'

let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

console.log(authorizeURL);

opn(authorizeURL);
