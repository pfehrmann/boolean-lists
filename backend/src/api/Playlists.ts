import * as Express from "express";
import {Playlist} from "../spotify/Playlist";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";

const router: Express.Router = Express.Router();

router.get("/", async (req, res) => {
    const api = new InitializedSpotifyApi((req as any).api);
    try {
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
        res.sendStatus(500);
    }
});

export default router;