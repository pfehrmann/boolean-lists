import * as React from "react";
import * as SRD from "storm-react-diagrams";
import SpotifyPlaylistNodeModel from "./SpotifyPlaylistNodeModel";
import SpotifyPlaylistNodeWidget from "./SpotifyPlaylistNodeWidget";

export default class SpotifyPlaylistNodeFactory extends SRD.AbstractNodeFactory {
    constructor() {
        super("spotifyPlaylist");
    }

    public generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.NodeModel): JSX.Element {
        return <SpotifyPlaylistNodeWidget node={node}/>;
    }

    public getNewInstance() {
        return new SpotifyPlaylistNodeModel();
    }
}
