import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "winston";
import {Playlist} from "../spotify/Playlist";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";

const router: express.Router = express.Router();

router.use(bodyParser.json());

router.get("/playlist", async (req, res) => {
    const api = new InitializedSpotifyApi((req as any).api);
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

export default router;
