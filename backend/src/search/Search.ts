import * as express from "express";
import * as SpotifyApi from "../SpotifyApi";
import * as bodyParser from "body-parser";
import * as logger from "winston";

export class Search {
    public readonly router: express.Router;

    constructor(api: SpotifyApi.InitializedSpotifyApi) {
        this.router = express.Router();

        this.router.use(bodyParser.json());

        this.router.get("/playlist", async (req, res) => {
            logger.info(req);
            let internalPlaylists = await api.searchForPlaylists(req.query.q);
            let playlists = internalPlaylists.map((playlist: SpotifyApi.Playlist) => {
                return {
                    name: playlist.name(),
                    userId: playlist.userId(),
                    id: playlist.id(),
                    image: playlist.image()
                }
            });

            res.json(playlists);
        })
    }
}