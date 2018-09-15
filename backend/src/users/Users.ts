import * as express from "express";
import * as mongoose from "mongoose";
import * as logger from "winston";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);

const Schema = mongoose.Schema;

const Playlist = new Schema({
    description: String,
    graph: String,
    name: String,
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
}

router.get("/playlists", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    const user = await getOrCreateUser(id);

    const playlists: IPlaylist[] = [];
    for (const playlist of user.playlists) {
        playlists.push({
            description: playlist.description,
            graph: playlist.graph,
            name: playlist.name,
        });
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
        });
    } else {
        res.sendStatus(404);
    }
});

function findPlaylist(user: any, name: string) {
    return user.playlists.find((playlistItem: any) => playlistItem.name === name);
}

router.post("/playlists", async (req, res) => {
    const id: string = (req as any).kauth.grant.access_token.content.sub;
    logger.info(`Searching user with id ${id}`);
    const user = await getOrCreateUser(id);

    const playlist = findPlaylist(user, req.body.name);
    if (playlist) {
        playlist.description = req.body.description;
        playlist.graph = req.body.graph;
        playlist.name = req.body.name;
    } else {
        user.playlists.push({
            description: req.body.description,
            graph: req.body.graph,
            name: req.body.name,
        });
    }
    await user.save();

    res.sendStatus(200);
});

export default router;
