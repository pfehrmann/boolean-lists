import * as mongoose from "mongoose";
import {PlaylistSchema} from "./Playlist";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    authorization: {
        accessToken: String,
        expiresAt: Number,
        refreshToken: String,
    },
    id: String,
    playlists: [PlaylistSchema],
}, {strict: true});

export const User = mongoose.model("User", UserSchema);

export async function getOrCreateUser(id: string) {
    let user = await User.findOne({id});
    if (!user) {
        user = User.create({id});
    }

    return user;
}

export function findPlaylist(user: any, name: string) {
    return user.playlists.find((playlistItem: any) => playlistItem.name === name);
}
