import * as mongoose from "mongoose";
import {arrayProp, instanceMethod, InstanceType, prop, Typegoose} from "typegoose";
import {Playlist} from "./Playlist";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);

export class User extends Typegoose {
    @prop()
    public authorization: {
        accessToken: string,
        expiresAt: number,
        refreshToken: string,
    };

    @arrayProp({ items: Playlist })
    public playlists: Playlist[];

    @instanceMethod
    public findPlaylist(this: InstanceType<User>, name: string): Playlist {
        return this.playlists.find((playlist) => playlist.name === name);
    }
}

export const UserModel = new User().getModelForClass(User);

export async function getOrCreateUser(id: string) {
    let user = await UserModel.findOne({id});
    if (!user) {
        user = await UserModel.create({id});
    }

    return user;
}
