import mongoose, { Model, Schema } from "mongoose";
import * as logger from "winston";
import { IPlaylist, PlaylistSchema } from "./Playlist";

export interface IUser {
  authorization: {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
  };
  playlists: IPlaylist[];
  spotifyId: string;
}

export interface IUserMethods {
  findPlaylist(name: string): IPlaylist | undefined;
  saveOrUpdatePlaylist(this: IUser, playlist: IPlaylist): Promise<IPlaylist>;
  deletePlaylist(this: IUser, name: string): Promise<void>;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findOrCreate: (spotifyId: string) => Promise<IUser>;
}

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    spotifyId: { type: String, required: true },
    authorization: {
      accessToken: String,
      expiresAt: Number,
      refreshToken: String,
    },
    playlists: [PlaylistSchema],
  },
  {
    statics: {
      async findOrCreate(spotifyId: string): Promise<IUser> {
        const result = await this.findOne({ where: { spotifyId } });

        if (result) {
          return result;
        }

        return new User({ spotifyId }).save();
      },
    },
    methods: {
      findPlaylist(this: IUser, name: string): IPlaylist | undefined {
        return this.playlists.find((playlist) => playlist.name === name);
      },
      async saveOrUpdatePlaylist(
        this: IUser & IUserMethods & { save: () => Promise<IUser> },
        playlist: IPlaylist
      ): Promise<IPlaylist> {
        const graph =
          typeof playlist.graph !== "string"
            ? JSON.stringify(playlist.graph)
            : playlist.graph;

        let playlistEntity: IPlaylist = this.findPlaylist(playlist.name);
        if (!playlistEntity) {
          playlistEntity = {
            ...playlist,
            graph,
          };
          this.playlists.push(playlistEntity);
        } else {
          playlistEntity = {
            ...playlist,
            graph,
          };
        }

        await this.save();
        return playlistEntity;
      },
      async deletePlaylist(name: string) {
        const playlist = this.findPlaylist(name);
        if (playlist) {
          logger.info(`Found playlist ${name}, deleting it`);
          this.playlists.splice(this.playlists.indexOf(playlist), 1);
          await this.save();
        }
      },
    },
  }
);

export const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
