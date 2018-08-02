import * as React from 'react';
import './App.css';

import * as SRD from "storm-react-diagrams";
import Graph from './Graph'

import logo from './logo.svg';

class App extends React.Component {
    private readonly engine: SRD.DiagramEngine;
    private readonly model: SRD.DiagramModel;

    constructor(props: any) {
        super(props);

        const engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        const model = new SRD.DiagramModel();
        this.model = model;

        this.addDefaultNodes();

        engine.setDiagramModel(model);
        this.engine = engine;

        this.addPlaylistNode = this.addPlaylistNode.bind(this);
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
                    <button onClick={this.addPlaylistNode}>Add a Playlistnode</button>
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

    private addDefaultNodes() {
        const node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
        const port1 = node1.addOutPort("Out");
        node1.setPosition(100, 100);

        const node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
        const port2 = node2.addInPort("In");
        node2.setPosition(400, 100);

        const link1 = port1.link(port2);

        this.model.addAll(node1, node2, link1);
    }
}

export default App;
