import * as findOrCreate from "mongoose-findorcreate";
import {arrayProp, instanceMethod, InstanceType, plugin, prop, Typegoose} from "typegoose";
import {Playlist} from "./Playlist";

export interface IFindOrCreateResult<T> {
    created: boolean;
    doc: InstanceType<T>;
}

@plugin(findOrCreate)
export class User extends Typegoose {
    public static findOrCreate: (condition: any) => Promise<IFindOrCreateResult<User>>;

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

    @instanceMethod
    public async saveOrUpdatePlaylist(this: InstanceType<User>, playlist: Playlist): Promise<Playlist> {
        const graph = typeof playlist.graph !== "string" ? JSON.stringify(playlist.graph) : playlist.graph;

        let playlistEntity: Playlist = this.findPlaylist(playlist.name);
        if (!playlistEntity) {
            playlistEntity = new Playlist();
            this.playlists.push(playlistEntity);
        }

        playlistEntity.description = playlist.description;
        playlistEntity.graph = graph;
        playlistEntity.name = playlist.name;
        playlistEntity.uri = playlist.uri;

        await this.save();
        return playlistEntity;
    }
}

export const UserModel = new User().getModelForClass(User);
