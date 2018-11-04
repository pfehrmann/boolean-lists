import * as mongoose from "mongoose";
import {prop, Typegoose} from "typegoose";
import * as logger from "winston";
import * as User from "./User";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);

export class Playlist extends Typegoose {
    @prop()
    public description: string;

    @prop()
    public graph: string;

    @prop()
    public name: string;

    @prop()
    public uri: string;
}

export async function savePlaylist(userId: string, playlist: Playlist, uri?: string) {
    logger.info(`Searching user with id ${userId}`);
    const user = await User.getOrCreateUser(userId);
    const graph = typeof playlist.graph !== "string" ? JSON.stringify(playlist.graph) : playlist.graph;
    if (uri) {
        playlist.uri = uri;
    }

    let playlistEntity: Playlist = user.findPlaylist(playlist.name);
    if (playlistEntity) {
        playlistEntity.description = playlist.description;
        playlistEntity.graph = graph;
        playlistEntity.name = playlist.name;
        playlistEntity.uri = playlist.uri;
    } else {
        playlistEntity = new Playlist();

        playlistEntity.description = playlist.description;
        playlistEntity.graph = graph;
        playlistEntity.name = playlist.name;
        playlistEntity.uri = playlist.uri;

        user.playlists.push(playlistEntity);
    }
    await user.save();
}
