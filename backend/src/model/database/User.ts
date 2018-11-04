import * as mongoose from "mongoose";
import {IPlaylist, PlaylistSchema} from "./Playlist";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);
const Schema = mongoose.Schema;

interface IUser {
    authorization?: {
        accessToken: string,
        expiresAt: number,
        refreshToken: string,
    };
    playlists: IPlaylist[];
}

interface IUserModel extends IUser, mongoose.Document {}

const UserSchema = new Schema({
    authorization: {
        accessToken: String,
        expiresAt: Number,
        refreshToken: String,
    },
    id: String,
    playlists: [PlaylistSchema],
}, {strict: true});

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);

export async function getOrCreateUser(id: string) {
    let user = await User.findOne({id});
    if (!user) {
        user = await User.create({id});
    }

    return user;
}

export function findPlaylist(user: any, name: string) {
    return user.playlists.find((playlistItem: any) => playlistItem.name === name);
}
