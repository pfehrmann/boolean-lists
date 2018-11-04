import * as Express from "express";
import * as logger from "winston";
import {Playlist} from "../model/spotify/Playlist";
import {InitializedSpotifyApi} from "../model/spotify/SpotifyApi";

const router: Express.Router = Express.Router();

router.get("/", async (req, res) => {
    try {
        logger.info("Get api from request...");
        const api = new InitializedSpotifyApi((req as any).api);
        if (req.query.uri) {
            const rawPlaylist = await Playlist.fromSpotifyUri(api, await (await api.me()).id(), req.query.uri);
            res.send({
                id: rawPlaylist.id(),
                image: rawPlaylist.image(),
                name: rawPlaylist.name(),
                userId: rawPlaylist.userId(),
            });
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        throw new Error(error);
    }
});

export default router;
