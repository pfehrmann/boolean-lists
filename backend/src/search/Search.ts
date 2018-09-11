import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "winston";
import {Album} from "../spotify/Album";
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

router.get("/album", async (req, res) => {
    const api = new InitializedSpotifyApi((req as any).api);
    logger.info(req);
    const internalAlbums = await api.searchForAlbums(req.query.q);
    const albums = internalAlbums.map((album: Album) => {
        const artists: Array<{id: string, name: string}> = album.artists().map((artist) => {
            return {
                id: artist.id(),
                name: artist.name(),
            };
        });
        return {
            artists,
            id: album.id(),
            image: album.image(),
            name: album.name(),
        };
    });

    res.json(albums);
});

export default router;
