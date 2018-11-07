import * as bodyParser from "body-parser";
import * as express from "express";
import {InstanceType} from "typegoose";
import * as logger from "winston";
import {User} from "../model/database/User";
import {Album} from "../model/spotify/Album";
import {getApiFromUser} from "../model/spotify/Authorization";
import {Playlist} from "../model/spotify/Playlist";

const router: express.Router = express.Router();

router.use(bodyParser.json());

router.get("/playlist", async (req, res) => {
    try {
        const user: InstanceType<User> = (req as any).user;
        const api = await getApiFromUser(user);
        const page = req.query.page ? req.query.page : 0;
        const elementsPerPage = 20;
        const internalPlaylists = await api.searchForPlaylists(req.query.q, {
            limit: elementsPerPage,
            offset: page * elementsPerPage,
        });
        logger.info(internalPlaylists);
        const playlists = internalPlaylists.map((playlist: Playlist) => {
            return {
                id: playlist.id(),
                image: playlist.image(),
                name: playlist.name(),
                userId: playlist.userId(),
            };
        });

        res.json({
            // TODO: get actual elements count
            elements: 0,
            elementsPerPage,
            page,
            playlists,
        });
    } catch (error) {
        logger.error(error.trace);
        res.sendStatus(500);
    }
});

router.get("/album", async (req, res) => {
    const user: InstanceType<User> = (req as any).user;
    const api = await getApiFromUser(user);
    const page = req.query.page ? req.query.page : 0;
    const elementsPerPage = 20;
    const internalAlbums = await api.searchForAlbums(req.query.q, {
        limit: elementsPerPage,
        offset: page * elementsPerPage,
    });
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

    res.json({
        albums,
        // TODO: get actual elements count
        elements: 0,
        elementsPerPage,
        page,
    });
});

export default router;
