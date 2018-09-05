import {NextFunction, Request, Response} from "express";
import * as logger from "winston";
import {sleep} from "../util";
import {Playlist} from "./Playlist";
import {Track} from "./Track";
import {User} from "./User";

const SpotifyWebApi = require("spotify-web-api-node");
const opn = require("opn");
const express = require("express");

const Cache = require("async-disk-cache");

const userCache = new Cache("user-cache");
const trackCache = new Cache("track-cache");

let initializedSpotifyApi;

const sleepDelay = 50;

export function initialize(): Promise<InitializedSpotifyApi> {
    if (initializedSpotifyApi) {
        return new Promise((resolve: any, reject: any) => {
            resolve(initializedSpotifyApi);
        });
    }

    return new Promise((resolve: any, reject: any) => {
        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: process.env.REDIRECT_URI,
        });

        const scopes = ["user-read-private",
            "playlist-read-private",
            "playlist-modify-public",
            "playlist-modify-private",
            "user-top-read"];
        const state = "random-state";

        const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

        opn(authorizeURL);

        let server: any;
        const app = express();
        app.get("/auth/spotify/callback", (req: Request, res: Response, next: NextFunction) => {
            spotifyApi.setAccessToken(req.query.code);
            spotifyApi.authorizationCodeGrant(req.query.code).then((data: any) => {

                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body.access_token);
                spotifyApi.setRefreshToken(data.body.refresh_token);

                initializedSpotifyApi = new InitializedSpotifyApi(spotifyApi);
                resolve(initializedSpotifyApi);
            }).catch((error: any) => {
                reject(error);
            });
            res.end("<script>//window.close()</script>");
            server.close();
        });

        server = app.listen(8080, () => {
            logger.info("Listening on port 8080");
        });
    });
}

export enum TimeRanges {
    LONG = "long_term",
    MEDIUM = "medium_term",
    SHORT = "short_term",
}

export class InitializedSpotifyApi {
    public spotifyApi: any;

    constructor(spotifyApi: any) {
        this.spotifyApi = spotifyApi;
    }

    public async me(): Promise<User> {
        return new User(this, this.spotifyApi.getMe());
    }

    public async createPlaylist(id: any, playlistName: string, options: any): Promise<any> {
        return await this.spotifyApi.createPlaylist(id, playlistName, options);
    }

    public async getMyTopTracks(timeRange: TimeRanges): Promise<Track[]> {
        const tracks: Track[] = [];
        const rawTracks = await this.spotifyApi.getMyTopTracks({time_range: timeRange, limit: 50});
        for (const rawTrack of rawTracks.body.items) {
            tracks.push(new Track(rawTrack));
        }
        return tracks;
    }

    public async searchForPlaylists(name: string): Promise<Playlist[]> {
        const rawPlaylists = await this.spotifyApi.searchPlaylists(name);
        return rawPlaylists.body.playlists.items.map((item: any) => new Playlist(this, item));
    }

    public async getAllUserPlaylists(id: any) {
        return await getAll<Playlist>(this.spotifyApi,
            this.spotifyApi.getUserPlaylists,
            (i) => new Playlist(this, i),
            [id]);
    }
}

export async function getAll<T>(spotifyApi: any,
                                spotifyFunction: (...args: any[]) => Promise<any>,
                                constructor: (item: any) => T, args: any[],
                                options: any = {offset: 0}) {
    const completeArgs = [...args];
    completeArgs.push(options);

    const result = await spotifyFunction.apply(spotifyApi, completeArgs);
    const items: T[] = result.body.items.map((item: any) => constructor(item));

    if (result.body.next) {
        await sleep(sleepDelay);
        return items.concat(await getAll(spotifyApi, spotifyFunction, constructor, args, {
            offset: result.body.items.length + options.offset,
        }));
    }
    return items;
}
