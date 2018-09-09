import * as express from "express";
import * as mongoose from "mongoose";
import * as SpotifyWebApi from "spotify-web-api-node";
import * as uuid from "uuid/v1";

const authRequests: Map<string, (spotifyWebApi: any, res: express.Response) => any> =
    new Map<string, (spotifyWebApi: any, res: express.Response) => any>();

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    accessToken: String,
    expiresAt: Number,
    id: String,
    refreshToken: String,
});

const User = mongoose.model("User", UserSchema);

export function authorized(): express.Handler {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        await addApiToRequest(req);
        if ((req as any).api) {
            next();
            return;
        }

        // Send unauthorized status
        res.sendStatus(401);
    };
}

async function addApiToRequest(req: express.Request) {
    const userId: string = (req as any).kauth.grant.access_token.content.sub;
    const user = await User.findOne({id: userId});

    if (user) {
        if (user.accessToken && user.refreshToken) {
            let api = userToSpotifyApi(user);

            if (Date.now() > user.expiresAt) {
                api = await refreshCredentials(user);
            }

            (req as any).api = api;
        }
    } else {
        await User.create({id: userId});
    }
}

function userToSpotifyApi(user: any) {
    const api = createSpotifyApi();
    api.setAccessToken(user.accessToken);
    api.setRefreshToken(user.refreshToken);
    return api;
}

async function refreshCredentials(user: any) {
    const api = userToSpotifyApi(user);
    const response = await api.refreshAccessToken();
    user.accessToken = response.body.access_token;
    if (response.body.refreshToken) {
        user.refreshToken = response.body.refresh_token;
    }
    user.expiresAt = response.body.expires_in * 1000 + Date.now();
    user.save();
    return userToSpotifyApi(user);
}

export function getRouter(keycloak: any): express.Router {
    const router = express.Router();

    router.get("/callback", (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const spotifyApi = createSpotifyApi();
        spotifyApi.setAccessToken(req.query.code);
        spotifyApi.authorizationCodeGrant(req.query.code).then(async (data: any) => {

            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(data.body.access_token);
            spotifyApi.setRefreshToken(data.body.refresh_token);
            spotifyApi.expiresAt = Date.now() + data.body.expires_in * 1000;

            // call the function to resume the flow
            authRequests.get(req.query.state)(spotifyApi, res);
        });
    });

    // log in to spotify
    router.get("/login",
        keycloak.middleware(),
        keycloak.protect(),
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // check if we already have the credentials
        addApiToRequest(req);
        if ((req as any).api) {
            next();
        }

        const tempSpotifyApi = createSpotifyApi();
        const requestId = uuid();
        const authorizeURL = getAuthorizeUrl(tempSpotifyApi, requestId);

        authRequests.set(requestId, async (spotifyApi: any, authorizedRes: express.Response) => {
            (req as any).api = spotifyApi;

            // save tokens to db
            const userId: string = (req as any).kauth.grant.access_token.content.sub;
            const user = await User.findOne({id: userId});
            user.accessToken = spotifyApi.getAccessToken();
            user.refreshToken = spotifyApi.getRefreshToken();
            user.expiresAt = spotifyApi.expiresAt;
            user.save();

            authorizedRes.redirect(req.query.url);
        });

        res.redirect(authorizeURL);
    });

    return router;
}

function createSpotifyApi() {
    return new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
    });
}

function getAuthorizeUrl(spotifyApi: any, state: string) {
    const scopes = ["user-read-private",
        "playlist-read-private",
        "playlist-modify-public",
        "playlist-modify-private",
        "user-top-read"];

    return spotifyApi.createAuthorizeURL(scopes, state);
}
