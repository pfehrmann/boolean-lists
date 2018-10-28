import * as express from "express";
import * as mongoose from "mongoose";
import * as logger from "winston";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);

const Schema = mongoose.Schema;

const Playlist = new Schema({
    description: String,
    graph: String,
    name: String,
    uri: String,
});

const UserSchema = new Schema({
    authorization: {
        accessToken: String,
        expiresAt: Number,
        refreshToken: String,
    },
    id: String,
    playlists: [Playlist],
}, {strict: true});

export const User = mongoose.model("User", UserSchema);

export async function getOrCreateUser(id: string) {
    let user = await User.findOne({id});
    if (!user) {
        user = User.create({id});
    }

    return user;
}

const router: express.Router = express.Router();

interface IPlaylist {
    description: string;
    graph: string;
    name: string;
    uri: string;
}

router.get("/playlists", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    const user = await getOrCreateUser(id);

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

    res.json(playlists);
});

router.get("/playlist/:id", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    const user = await getOrCreateUser(id);

    const playlist = findPlaylist(user, req.params.id);
    if (playlist) {
        res.json({
            description: playlist.description,
            graph: playlist.graph,
            name: playlist.name,
            uri: playlist.uri,
        });
    } else {
        res.sendStatus(404);
    }
});

function findPlaylist(user: any, name: string) {
    return user.playlists.find((playlistItem: any) => playlistItem.name === name);
}

export async function savePlaylist(userId: string, playlist: IPlaylist, uri?: string) {
    logger.info(`Searching user with id ${userId}`);
    const user = await getOrCreateUser(userId);
    const graph = typeof playlist.graph !== "string" ? JSON.stringify(playlist.graph) : playlist.graph;
    if (uri) {
        playlist.uri = uri;
    }

    const playlistEntity = findPlaylist(user, playlist.name);
    if (playlistEntity) {
        playlistEntity.description = playlist.description;
        playlistEntity.graph = graph;
        playlistEntity.name = playlist.name;
        playlistEntity.uri = playlist.uri;
    } else {
        user.playlists.push({
            description: playlist.description,
            graph,
            name: playlist.name,
            uri: playlist.uri,
        });
    }
    await user.save();
}

router.post("/playlists", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;

    savePlaylist(id, req.body);

    res.sendStatus(200);
});

router.delete("/playlist/:id", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    logger.info(`Searching user with id ${id}`);
    const user = await getOrCreateUser(id);

    const playlist = findPlaylist(user, req.params.id);
    if (playlist) {
        logger.info(`Found playlist ${req.params.id}, deleting it`);
        await playlist.remove();
        await user.save();
    }

    res.sendStatus(200);
});

export default router;
