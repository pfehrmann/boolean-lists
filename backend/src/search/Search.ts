import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "winston";
import {Playlist} from "../spotify/Playlist";
import * as SpotifyApi from "../spotify/SpotifyApi";

export class Search {
    public readonly router: express.Router;

    constructor(api: SpotifyApi.InitializedSpotifyApi) {
        this.router = express.Router();

        this.router.use(bodyParser.json());

        this.router.get("/playlist", async (req, res) => {
            logger.info(req);
            const internalPlaylists = await api.searchForPlaylists(req.query.q);
            const playlists = internalPlaylists.map((playlist: Playlist) => {
                return {
                    id: playlist.id(),
                    image: playlist.image(),
                    name: playlist.name(),
                    userId: playlist.userId(),
                };
            });

            res.json(playlists);
        });
    }
}
