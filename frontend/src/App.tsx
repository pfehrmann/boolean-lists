import * as React from 'react';
import './App.css';

import * as SRD from "storm-react-diagrams";
import Graph from './Graph'

import {SimplePortFactory} from "./nodes/SimplePortFactory";
import SpotifyPlaylistNodeFactory from "./nodes/SpotifyPlaylistNodeFactory";
import SpotifyPlaylistNodeModel from "./nodes/SpotifyPlaylistNodeModel";
import SpotifyPlaylistPortModel from "./nodes/SpotifyPlaylistPortModel";

import AddNodeFactory from "./nodes/AddNodeFactory";
import AddNodeModel from "./nodes/AddNodeModel";

import logo from './logo.svg';

class App extends React.Component {
    private readonly engine: SRD.DiagramEngine;
    private readonly model: SRD.DiagramModel;

    constructor(props: any) {
        super(props);

        const engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        // register some other factories as well
        engine.registerPortFactory(new SimplePortFactory("spotifyPlaylist", () => new SpotifyPlaylistPortModel()));
        engine.registerNodeFactory(new SpotifyPlaylistNodeFactory());

        engine.registerNodeFactory(new AddNodeFactory());

        const model = new SRD.DiagramModel();
        this.model = model;

        this.addDefaultNodes();

        engine.setDiagramModel(model);
        this.engine = engine;

        this.addPlaylistNode = this.addPlaylistNode.bind(this);
        this.addAddNode = this.addAddNode.bind(this);
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
                    <button onClick={this.addPlaylistNode}>Add a PlaylistNode</button>
                    <button onClick={this.addAddNode}>Add an AddNode</button>
                </div>
                <Graph engine={this.engine}/>
            </div>
        );
    }

    public addPlaylistNode() {
        const node = new SRD.DefaultNodeModel("Playlist", "rgb(0,192,255)");
        node.addOutPort("Out");
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
        // 3-A) create a default node
        const node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
        const port1 = node1.addOutPort("Out");
        node1.setPosition(100, 150);

        // 3-B) create our new custom node
        const node2 = new SpotifyPlaylistNodeModel();
        node2.setPosition(250, 108);

        const node3 = new SRD.DefaultNodeModel("Node 3", "red");
        node3.addInPort("In");
        node3.setPosition(500, 150);

        // 3-C) link the 2 nodes together
        let link1;
        const portLeft = node2.getPort("left");
        if (portLeft) {
            link1 = port1.link(portLeft);
        }

        let link2;
        const portRight = node2.getPort("right");
        if (portRight) {
            link2 = port1.link(portRight);
        }

        // 4) add the models to the root graph
        if ((link1) && (link2)) {
            this.model.addAll(node1, node2, node3, link1, link2);
        } else {
            alert("Could not create links!");
        }

    }
}

export default App;
