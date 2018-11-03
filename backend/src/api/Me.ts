import * as express from "express";
import * as logger from "winston";
import { IPlaylist, savePlaylist } from "../model/database/Playlist";
import * as User from "../model/database/User";
import {fromJSON} from "../model/nodes/JsonParser";
import {addApiToRequest} from "../model/spotify/Authorization";
import {Playlist as SpotifyPlaylist} from "../model/spotify/Playlist";
import {InitializedSpotifyApi} from "../model/spotify/SpotifyApi";
import { convert } from "../service/serilizationConverter";

const router: express.Router = express.Router();

router.get("/", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    const user = await User.getOrCreateUser(id);

    const connectedToSpotify: boolean = user.authorization && Date.now() < user.authorization.expiresAt;

    res.json({
        connectedToSpotify,
    });
});

router.get("/playlist", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    const user = await User.getOrCreateUser(id);

    const playlists: IPlaylist[] = [];
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
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    const user = await User.getOrCreateUser(id);

    const playlist = User.findPlaylist(user, req.params.id);
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
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    try {
        await savePlaylist(id, req.body);
        if (req.body.saveToSpotify) {
            await savePlaylistToSpotify(req, res);
        } else {
            res.json({});
        }
    } catch (error) {
        logger.error(error);
        res.sendStatus(500);
    }
});

async function savePlaylistToSpotify(req: any, res: any) {
    try {
        await addApiToRequest(req);
        const api: InitializedSpotifyApi = new InitializedSpotifyApi((req as any).api);
        const serialized = convert(req.body.graph);

        logger.info("Using parsed node", serialized);
        const node = await fromJSON(api, serialized);

        const tracksToAdd = await node.getTracks();
        logger.info(`Adding ${tracksToAdd.length} tracks.`);

        const me = await api.me();

        let playlist: SpotifyPlaylist;
        if (req.body.uri) {
            playlist = await SpotifyPlaylist.fromSpotifyUri(api, await me.id(), req.body.uri);
            if (playlist.name() !== req.body.name) {
                playlist = await me.createPlaylist(req.body.name);
            }
        } else if (req.body.name) {
            playlist = await me.createPlaylist(req.body.name);
        } else {
            throw new Error("Enter a name of a playlist");
        }

        await playlist.clear();
        await playlist.addTracks(tracksToAdd);

        res.json({message: "Successfully added songs.", playlistUri: playlist.id()});
    } catch (error) {
        logger.error(error.stack);
        res.sendStatus(500);
    }
}

router.delete("/playlist/:id", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    logger.info(`Searching user with id ${id}`);
    const user = await User.getOrCreateUser(id);

    const playlist = User.findPlaylist(user, req.params.id);
    if (playlist) {
        logger.info(`Found playlist ${req.params.id}, deleting it`);
        await playlist.remove();
        await user.save();
    }

    res.sendStatus(200);
});

export default router;
