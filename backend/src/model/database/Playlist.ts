import { Schema } from "mongoose";

export interface IPlaylist {
  description: string;
  graph: string;
  name: string;
  uri: string;
}

export const PlaylistSchema = new Schema<IPlaylist>({
  description: { type: String },
  graph: { type: String },
  name: { type: String },
  uri: { type: String },
});
