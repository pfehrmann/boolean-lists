import Button from '@material-ui/core/Button';
import * as Keycloak from 'keycloak-js';
import * as React from 'react';
import * as SRD from "storm-react-diagrams";
import * as logger from 'winston';
import * as RequestWrapper from "../api/RequestWrapper";
import '../App.css';
import Graph from '../components/Graph'
import {SerializationDialog} from "../components/SerializationDialog";

import AddNodeFactory from "../nodes/AddNode/AddNodeFactory";
import AlbumNodeFactory from "../nodes/AlbumNode/AlbumNodeFactory";
import LimitNodeFactory from "../nodes/LimitNode/LimitNodeFactory";
import MyTopTracksNodeFactory from "../nodes/MyTopTracksNode/MyTopTracksNodeFactory";
import PlaylistNodeFactory from "../nodes/PlaylistNode/PlaylistNodeFactory";
import RandomizeNodeFactory from "../nodes/RandomizeNode/RandomizeNodeFactory";
import SubtractNodeFactory from "../nodes/SubtractNode/SubtractNodeFactory";

import {AddNodesElement} from "../components/AddNodesElement";
import AddNodeModel from "../nodes/AddNode/AddNodeModel";
import PlaylistNodeModel from "../nodes/PlaylistNode/PlaylistNodeModel";

interface IEditorState {
    configOpen: boolean;
    loginSpotifyOpen: boolean;
    keycloak: Keycloak.KeycloakInstance;
}

class Editor extends React.Component {
    public state: IEditorState;

    private readonly engine: SRD.DiagramEngine;
    private readonly model: SRD.DiagramModel;

    constructor(props: any) {
        super(props);

        this.state = {
            configOpen: false,
            keycloak: Keycloak("/keycloak.json"),
            loginSpotifyOpen: false
        };

        RequestWrapper.setKeycloak(this.state.keycloak);

        const engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        // register some other factories as well
        engine.registerNodeFactory(new AddNodeFactory());
        engine.registerNodeFactory(new PlaylistNodeFactory());
        engine.registerNodeFactory(new LimitNodeFactory());
        engine.registerNodeFactory(new RandomizeNodeFactory());
        engine.registerNodeFactory(new SubtractNodeFactory());
        engine.registerNodeFactory(new MyTopTracksNodeFactory());
        engine.registerNodeFactory(new AlbumNodeFactory());

        const model = new SRD.DiagramModel();
        this.model = model;

        this.addDefaultNodes();

        engine.setDiagramModel(model);
        this.engine = engine;

        this.saveToSpotify = this.saveToSpotify.bind(this);

        this.connectSpotify = this.connectSpotify.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    public render() {
        return (
            <div className="editor">
                <div>
                    <Button variant="contained" color="primary" onClick={this.handleOpen}>Serialization</Button>
                    <Button variant="contained" color="primary" onClick={this.saveToSpotify}>Save to Spotify</Button>
                    <Button variant="contained" color="primary" onClick={this.connectSpotify}>Connect Spotify</Button>
                    <AddNodesElement engine={this.engine} model={this.model}/>
                </div>
                <Graph engine={this.engine}/>
                <SerializationDialog model={this.model} onSave={this.handleSave} onClose={this.handleClose}
                                     configOpen={this.state.configOpen}/>
            </div>
        );
    }

    public componentDidMount() {
        this.state.keycloak.init({onLoad: 'login-required'});
    }

    public handleOpen() {
        this.setState({
            configOpen: true
        });
    }

    public handleClose() {
        this.setState({
            configOpen: false
        });
    }

    public handleSave(graph: string) {
        this.model.deSerializeDiagram(JSON.parse(graph), this.engine);
        this.setState({
            configOpen: false
        })
    }

    private addDefaultNodes() {

        const playlistNode = PlaylistNodeModel.getInstance();
        playlistNode.setPosition(100, 150);

        const addNode = AddNodeModel.getInstance();
        addNode.setPosition(500, 150);

        const link = playlistNode.getOutPorts()[0].link(addNode.getInPorts()[0]);

        this.model.addAll(playlistNode, addNode, link);
    }

    private connectSpotify() {
        window.location.assign(`${process.env.REACT_APP_API_BASE}/auth/spotify/login?url=${window.location.href}&authorization=Bearer ${this.state.keycloak.token}`);
    }

    private async saveToSpotify() {
        const data = JSON.stringify(this.model.serializeDiagram());
        logger.info(data);

        const response = await RequestWrapper.authorizedFetch(`${process.env.REACT_APP_API_BASE}/saveToSpotify`, {
            body: data,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            method: "POST"
        });
        logger.info(await response.json());
    }
}

export default Editor;
