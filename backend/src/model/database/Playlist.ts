import {prop, Typegoose} from "typegoose";

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
