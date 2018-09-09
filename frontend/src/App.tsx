import Button from '@material-ui/core/Button';
import * as Keycloak from 'keycloak-js';
import * as React from 'react';
import * as SRD from "storm-react-diagrams";
import * as logger from 'winston';
import * as RequestWrapper from "./api/RequestWrapper";
import './App.css';
import Graph from './Graph'
import logo from './logo.svg';

import AddNodeFactory from "./nodes/AddNode/AddNodeFactory";
import AddNodeModel from "./nodes/AddNode/AddNodeModel";

import PlaylistNodeFactory from "./nodes/PlaylistNode/PlaylistNodeFactory";
import PlaylistNodeModel from "./nodes/PlaylistNode/PlaylistNodeModel";

import LimitNodeFactory from "./nodes/LimitNode/LimitNodeFactory";
import LimitNodeModel from "./nodes/LimitNode/LimitNodeModel";

import RandomizeNodeFactory from "./nodes/RandomizeNode/RandomizeNodeFactory";
import RandomizeNodeModel from "./nodes/RandomizeNode/RandomizeNodeModel";

import {SerializationDialog} from "./components/SerializationDialog";
import SubtractNodeFactory from "./nodes/SubtractNode/SubtractNodeFactory";
import SubtractNodeModel from "./nodes/SubtractNode/SubtractNodeModel";

interface IAppState {
    configOpen: boolean;
    loginSpotifyOpen: boolean;
    keycloak: Keycloak.KeycloakInstance;
}

class App extends React.Component {
    public state: IAppState;

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

        const model = new SRD.DiagramModel();
        this.model = model;

        this.addDefaultNodes();

        engine.setDiagramModel(model);
        this.engine = engine;

        this.addPlaylistNode = this.addPlaylistNode.bind(this);
        this.addAddNode = this.addAddNode.bind(this);
        this.saveToSpotify = this.saveToSpotify.bind(this);
        this.addLimitNode = this.addLimitNode.bind(this);
        this.addRandomizeNode = this.addRandomizeNode.bind(this);
        this.addSubtractNode = this.addSubtractNode.bind(this);

        this.connectSpotify = this.connectSpotify.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>
                <div>
                    <Button variant="contained" color="primary" onClick={this.handleOpen}>Serialization</Button>
                    <Button variant="contained" color="primary" onClick={this.saveToSpotify}>Save to Spotify</Button>
                    <Button variant="contained" color="primary" onClick={this.addPlaylistNode}>Add a
                        PlaylistNode</Button>
                    <Button variant="contained" color="primary" onClick={this.addAddNode}>Add an AddNode</Button>
                    <Button variant="contained" color="primary" onClick={this.addSubtractNode}>Add a
                        SubtractNode</Button>
                    <Button variant="contained" color="primary" onClick={this.addLimitNode}>Add a LimitNode</Button>
                    <Button variant="contained" color="primary" onClick={this.addRandomizeNode}>Add a
                        RandomizeNode</Button>
                    <Button variant="contained" color="primary" onClick={this.connectSpotify}>Connect Spotify</Button>
                </div>
                <Graph engine={this.engine}/>
                <SerializationDialog model={this.model} onSave={this.handleSave} onClose={this.handleClose} configOpen={this.state.configOpen}/>
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

    public addPlaylistNode() {
        const node = PlaylistNodeModel.getInstance();
        node.setPosition(0, 0);

        this.model.addAll(node);
        this.engine.repaintCanvas();
    }

    public addAddNode() {
        const node = AddNodeModel.getInstance();
        node.setPosition(50, 10);

        this.model.addNode(node);
        this.engine.repaintCanvas();
    }

    public addSubtractNode() {
        const node = SubtractNodeModel.getInstance();
        node.setPosition(50, 10);

        this.model.addNode(node);
        this.engine.repaintCanvas();
    }

    public addLimitNode() {
        const node = LimitNodeModel.getInstance();
        node.setPosition(50, 10);

        this.model.addNode(node);
        this.engine.repaintCanvas();
    }

    public addRandomizeNode() {
        const node = RandomizeNodeModel.getInstance();
        node.setPosition(50, 10);

        this.model.addNode(node);
        this.engine.repaintCanvas();
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
        window.location.assign(`${process.env.REACT_APP_API_BASE}/auth/spotify/login?url=${process.env.REACT_APP_API_BASE}&authorization=Bearer ${this.state.keycloak.token}`);
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

export default App;
