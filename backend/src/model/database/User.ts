import * as findOrCreate from "mongoose-findorcreate";
import {arrayProp, instanceMethod, InstanceType, plugin, prop, staticMethod, Typegoose} from "typegoose";
import * as logger from "winston";
import {Playlist} from "./Playlist";

export interface IFindOrCreateResult<T> {
    created: boolean;
    doc: InstanceType<T>;
}

@plugin(findOrCreate)
export class User extends Typegoose {
    public static findOrCreate: (condition: any) => Promise<IFindOrCreateResult<User>>;

    @prop()
    public spotifyId: string;

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
            playlistEntity.description = playlist.description;
            playlistEntity.graph = graph;
            playlistEntity.name = playlist.name;
            playlistEntity.uri = playlist.uri;
            this.playlists.push(playlistEntity);
        } else {
            playlistEntity.description = playlist.description;
            playlistEntity.graph = graph;
            playlistEntity.name = playlist.name;
            playlistEntity.uri = playlist.uri;
        }

        await this.save();
        return playlistEntity;
    }

    @instanceMethod
    public async deletePlaylist(this: InstanceType<User>, name: string) {
        const playlist = this.findPlaylist(name);
        if (playlist) {
            logger.info(`Found playlist ${name}, deleting it`);
            this.playlists.splice(this.playlists.indexOf(playlist), 1);
            await this.save();
        }
    }
}

export const UserModel = new User().getModelForClass(User);
