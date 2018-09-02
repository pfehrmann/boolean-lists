import * as SRD from "storm-react-diagrams";

import {AbstractNodeWidget, IAbstractNodeProps} from "./AbstractNodeWidget";
import PlaylistNodeModel from "./PlaylistNodeModel";

export interface IPlaylistNodeProps extends IAbstractNodeProps<PlaylistNodeModel> {
    node: PlaylistNodeModel;
    diagramEngine: SRD.DiagramEngine;
}

export default class PlaylistNodeWidget extends AbstractNodeWidget<IPlaylistNodeProps> {
    constructor(props: IPlaylistNodeProps) {
        super("playlist-node", props);
        this.state = {};
    }

    public onDoubleClick() {
        alert("Double Clicked");
    }
}
