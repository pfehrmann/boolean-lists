import * as express from "express";
import * as SpotifyWebApi from "spotify-web-api-node";
import * as uuid from "uuid/v1";
import * as logger from "winston";
import {User, UserModel} from "../database/User";

const authRequests: Map<string, (spotifyWebApi: any, res: express.Response) => any> =
    new Map<string, (spotifyWebApi: any, res: express.Response) => any>();

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

export async function addApiToRequest(req: express.Request) {
    const userId: string = (req as any).kauth.grant.access_token.content.sub;
    const user = await UserModel.findOne({id: userId});

    if (user) {
        try {
            (req as any).api = getApiFromUser(user);
        } catch (error) {
            logger.info(`Could not create api for user ${userId}`);
        }
    } else {
        await UserModel.create({id: userId});
    }
}

export async function getApiFromUser(user: User): Promise<SpotifyWebApi> {
    if (user && user.authorization && user.authorization.accessToken && user.authorization.refreshToken) {
        let api = userToSpotifyApi(user);

        if (Date.now() > user.authorization.expiresAt) {
            api = await refreshCredentials(user);
        } else {
            logger.debug(`Not refreshing token, valid util ${user.authorization.expiresAt}`);
        }
        return api;
    }

    throw new Error("Cannot create api");
}

function userToSpotifyApi(user: User) {
    const api = createSpotifyApi();
    api.setAccessToken(user.authorization.accessToken);
    api.setRefreshToken(user.authorization.refreshToken);
    return api;
}

async function refreshCredentials(user: any) {
    logger.info("Refreshing credentials...");
    const api = userToSpotifyApi(user);
    let response;
    try {
        response = await api.refreshAccessToken();
    } catch (error) {
        logger.warn(error);
        throw new Error("Could not get refreshed token from spotify");
    }
    user.authorization.accessToken = response.body.access_token;
    if (response.body.refresh_token) {
        user.authorization.refreshToken = response.body.refresh_token;
    }
    user.authorization.expiresAt = response.body.expires_in * 1000 + Date.now();
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
            const user = await UserModel.findOne({id: userId});

            user.authorization = {
                accessToken: spotifyApi.getAccessToken(),
                expiresAt: spotifyApi.expiresAt,
                refreshToken: spotifyApi.getRefreshToken(),
            };

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
