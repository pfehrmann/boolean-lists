import * as express from "express";
import {InstanceType} from "typegoose";
import {User} from "../model/database/User";
import savePlaylistToSpotify from "../service/SavePlaylistToSpotify";

const router: express.Router = express.Router();

router.get("/", async (req, res) => {
    const user: InstanceType<User> = (req as any).user;

    const connectedToSpotify: boolean = user.authorization && Date.now() < user.authorization.expiresAt;

    res.json({
        connectedToSpotify,
    });
});

router.get("/playlist", async (req, res) => {
    const user: InstanceType<User> = (req as any).user;
    const playlists = [];
    for (const playlist of user.playlists) {
        if (playlist.name && playlist.graph) {
            playlists.push({
                description: playlist.description,
                graph: playlist.graph,
                name: playlist.name,
                uri: playlist.uri,
            });
        }
    }

    res.json({
        elements: playlists.length,
        elementsPerPage: playlists.length,
        page: 0,
        playlists,
    });
});

router.get("/playlist/:id", async (req, res) => {
    const user: InstanceType<User> = (req as any).user;

    const playlist = user.findPlaylist(req.params.id);
    if (playlist) {
        res.json({
            description: playlist.description,
            graph: JSON.parse(playlist.graph),
            name: playlist.name,
            uri: playlist.uri,
        });
    } else {
        res.sendStatus(404);
    }
});

router.post("/playlist", async (req, res) => {
    const user: InstanceType<User> = (req as any).user;

    const playlistEntity = await user.saveOrUpdatePlaylist(req.body);
    let response = {
        message: "success",
        playlistUri: playlistEntity.uri,
    };

    if (req.body.saveToSpotify) {
        response = await savePlaylistToSpotify(user.spotifyId, playlistEntity.name);
    }

    res.json(response);
});

router.delete("/playlist/:id", async (req, res) => {
    const user: InstanceType<User> = (req as any).user;
    await user.deletePlaylist(req.params.id);
    res.sendStatus(200);
});

export default router;
