import * as _ from "lodash";
import {DefaultLinkModel, DiagramEngine, LinkModel, PortModel} from "storm-react-diagrams";

export default class SpotifyPlaylistPortModel extends PortModel {
    private position: string | "top" | "bottom" | "left" | "right";

    constructor(pos: string = "top") {
        super(pos, "spotifyPlaylist");
        this.position = pos;
    }

    public serialize() {
        return _.merge(super.serialize(), {
            position: this.position
        });
    }

    public deSerialize(data: any, engine: DiagramEngine) {
        super.deSerialize(data, engine);
        this.position = data.position;
    }

    public createLinkModel(): LinkModel {
        return new DefaultLinkModel();
    }
}
