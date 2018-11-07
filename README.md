Booleanlists
============

Project for generating new Spotify Playlists with a node based logic.

Setup
-----
- Install and setup docker and docker-compose
- Setup your .env file. See below for details
- Run `docker-compose up`

General information
-------------------
This project contains a backend using NodeJs and a frontend using react. The backend uses mongodb to store data. The application uses only the Spotify authentication for user authentication.

.env
----
This project relies on .env files for an easy setup. The only file should have to change to take advantage of this is `./.env`. Avaliable properties are:
- `CLIENT_ID` The Spotify client id. See the Spotify documentation on how to get one
- `CLIENT_SECRET`the Spotify client secret. See the Spotify documentation on how to get one. Note: Make sure to never leak this to the public
- `REDIRECT_URI` to where should Spotify redirect after login. Should be similar to  `http://localhost:3000/auth/spotify/callback`
- `MONGOOSE_CONNECTION_STRING` Connection string for mongodb. Currently has to have the hardcoded password like `mongodb://root:example@mongodb`
- `PUBLIC_URL` the url, where the app is hosted
- `REACT_APP_API_BASE` base url for the api
- `REACT_APP_BASE` base url for the react application
