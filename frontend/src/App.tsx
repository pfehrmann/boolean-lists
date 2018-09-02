import * as React from 'react';
import './App.css';

import * as SRD from "storm-react-diagrams";
import Graph from './Graph'

import AddNodeFactory from "./nodes/AddNodeFactory";
import AddNodeModel from "./nodes/AddNodeModel";

import * as logger from 'winston';

import logo from './logo.svg';
import PlaylistNodeFactory from "./nodes/PlaylistNodeFactory";
import PlaylistNodeModel from "./nodes/PlaylistNodeModel";

class App extends React.Component {
    private readonly engine: SRD.DiagramEngine;
    private readonly model: SRD.DiagramModel;

    constructor(props: any) {
        super(props);

        const engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        // register some other factories as well
        engine.registerNodeFactory(new AddNodeFactory());
        engine.registerNodeFactory(new PlaylistNodeFactory());

        const model = new SRD.DiagramModel();
        this.model = model;

        this.addDefaultNodes();

        engine.setDiagramModel(model);
        this.engine = engine;

        this.addPlaylistNode = this.addPlaylistNode.bind(this);
        this.addAddNode = this.addAddNode.bind(this);
        this.saveToSpotify = this.saveToSpotify.bind(this);
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
                    <button onClick={this.saveToSpotify}>Save to Spotify</button>
                    <button onClick={this.addPlaylistNode}>Add a PlaylistNode</button>
                    <button onClick={this.addAddNode}>Add an AddNode</button>
                </div>
                <Graph engine={this.engine}/>
            </div>
        );
    }

    public addPlaylistNode() {
        const node = new PlaylistNodeModel();
        node.setPosition(0, 0);

        this.model.addAll(node);
        this.engine.repaintCanvas();
    }

    public addAddNode() {
        const node = new AddNodeModel();
        node.setPosition(50, 10);

        this.model.addNode(node);
        this.engine.repaintCanvas();
    }

    private addDefaultNodes() {

        const playlistNode = new PlaylistNodeModel();
        playlistNode.setPosition(100, 150);

        const addNode = new AddNodeModel();
        addNode.setPosition(500, 150);

        const link = playlistNode.getOutPorts()[0].link(addNode.getInPorts()[0]);

        this.model.addAll(playlistNode, addNode, link);
    }

    private async saveToSpotify() {
        const data = JSON.stringify(this.model.serializeDiagram());
        logger.info(data);

        const response = await fetch("http://localhost:3000/saveToSpotify", {
            body: data,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST"
        });
        logger.info(await response.json());
    }
}

export default App;
