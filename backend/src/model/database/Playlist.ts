import * as mongoose from "mongoose";
import * as logger from "winston";
import * as User from "./User";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);
const Schema = mongoose.Schema;

export const PlaylistSchema = new Schema({
    description: String,
    graph: String,
    name: String,
    uri: String,
});

export interface IPlaylist {
    description: string;
    graph: string;
    name: string;
    uri: string;
}

export async function savePlaylist(userId: string, playlist: IPlaylist, uri?: string) {
    logger.info(`Searching user with id ${userId}`);
    const user = await User.getOrCreateUser(userId);
    const graph = typeof playlist.graph !== "string" ? JSON.stringify(playlist.graph) : playlist.graph;
    if (uri) {
        playlist.uri = uri;
    }

    const playlistEntity = User.findPlaylist(user, playlist.name);
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
