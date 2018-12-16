import * as express from "express";
import * as SpotifyWebApi from "spotify-web-api-node";
import * as logger from "winston";
import {User, UserModel} from "../database/User";

import * as passport from "passport";
import * as PassportSpotify from "passport-spotify";
import {InitializedSpotifyApi} from "./SpotifyApi";
const SpotifyStrategy = PassportSpotify.Strategy;

const scope = ["user-read-private",
    "user-library-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-top-read"];

passport.serializeUser(async (user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    const userEntity = await UserModel.findById(userId);
    if (!userEntity) {
        return done(false);
    }
    done(null, userEntity);
});

passport.use(
    new SpotifyStrategy( {
        callbackURL: process.env.REDIRECT_URI,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: scope,
    }, async (accessToken, refreshToken, expiresIn: number, profile, done: (error: any, user?: any) => any) => {
        try {
            const userResponse = await UserModel.findOrCreate({spotifyId: profile.id});
            if (userResponse.created) {
                // handle creation of new users
            }
            const user = userResponse.doc;
            user.authorization = {
                accessToken,
                expiresAt: expiresIn * 1000 + Date.now(),
                refreshToken,
            };

            await user.save();

            done(undefined, user);
        } catch (error) {
            done(error);
        }
    }),
);

export async function getApiFromUser(user: User): Promise<InitializedSpotifyApi> {
    if (user && user.authorization && user.authorization.accessToken && user.authorization.refreshToken) {
        let api = userToSpotifyApi(user);

        if (Date.now() > user.authorization.expiresAt) {
            api = await refreshCredentials(user);
            logger.info("Token refreshed.");
        } else {
            logger.debug(`Not refreshing token, valid util ${user.authorization.expiresAt}`);
        }
        return new InitializedSpotifyApi(api);
    }

    throw new Error("Cannot create api");
}

function userToSpotifyApi(user: User) {
    const api = createSpotifyApi();
    api.setAccessToken(user.authorization.accessToken);
    api.setRefreshToken(user.authorization.refreshToken);
    return api;
}

function createSpotifyApi() {
    return new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
    });
}

async function refreshCredentials(user: any) {
    logger.info("Refreshing credentials...");
    logger.info("Get user from database...");
    const api = userToSpotifyApi(user);

    let response;
    try {
        logger.info("Ask Spotify for token...");
        response = await api.refreshAccessToken();
    } catch (error) {
        logger.warn(error);
        throw new Error("Could not get refreshed token from spotify");
    }

    logger.info("Updating database entity...");
    const refreshToken = response.body.refresh_token || user.authorization.refreshToken;
    user.authorization = {
        accessToken: response.body.access_token,
        expiresAt: response.body.expires_in * 1000 + Date.now(),
        refreshToken,
    };

    logger.info("Save to database...");
    await user.save();

    logger.info("Return api...");
    return userToSpotifyApi(user);
}

export function getRouter(): express.Router {
    const router = express.Router();

    router.get("/login",
        passport.authenticate("spotify", {
            scope,
            showDialog: true,
        } as any));

    router.get("/",
        passport.authenticate("spotify", {
            scope,
            showDialog: false,
        } as any));

    router.get(
        "/callback",
        passport.authenticate("spotify", {
            failureRedirect: "/error",
        }), (req, res) => {
            logger.info("in callback");
            res.cookie("logged_in", true);
            res.redirect(`${process.env.REACT_APP_BASE}/loginSuccess`);
        });

    router.get("/logout", (req, res) => {
        req.logout();
        res.cookie("logged_in", false);
        res.redirect(process.env.REACT_APP_BASE);
    });

    return router;
}

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.sendStatus(401);
}
