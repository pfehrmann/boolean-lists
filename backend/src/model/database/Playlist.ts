import { Schema } from "mongoose";
import { prop, Typegoose } from "typegoose";

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
