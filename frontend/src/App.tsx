import Button from '@material-ui/core/Button';
import * as React from 'react';
import * as SRD from "storm-react-diagrams";
import * as logger from 'winston';
import './App.css';
import Graph from './Graph'
import logo from './logo.svg';

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import AddNodeFactory from "./nodes/AddNode/AddNodeFactory";
import AddNodeModel from "./nodes/AddNode/AddNodeModel";

import PlaylistNodeFactory from "./nodes/PlaylistNode/PlaylistNodeFactory";
import PlaylistNodeModel from "./nodes/PlaylistNode/PlaylistNodeModel";

import LimitNodeFactory from "./nodes/LimitNode/LimitNodeFactory";
import LimitNodeModel from "./nodes/LimitNode/LimitNodeModel";

import RandomizeNodeFactory from "./nodes/RandomizeNode/RandomizeNodeFactory";
import RandomizeNodeModel from "./nodes/RandomizeNode/RandomizeNodeModel";

interface IAppState {
    configOpen: boolean;
    serializedGraph: string;
    newGraph: string;
}

class App extends React.Component {
    public state: IAppState;

    private readonly engine: SRD.DiagramEngine;
    private readonly model: SRD.DiagramModel;

    constructor(props: any) {
        super(props);

        this.state = {
            configOpen: false,
            newGraph: "",
            serializedGraph: ""
        };

        const engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        // register some other factories as well
        engine.registerNodeFactory(new AddNodeFactory());
        engine.registerNodeFactory(new PlaylistNodeFactory());
        engine.registerNodeFactory(new LimitNodeFactory());
        engine.registerNodeFactory(new RandomizeNodeFactory());

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

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
                    <Button variant="contained" color="primary" onClick={this.addLimitNode}>Add a LimitNode</Button>
                    <Button variant="contained" color="primary" onClick={this.addRandomizeNode}>Add a
                        RandomizeNode</Button>
                </div>
                <Graph engine={this.engine}/>
                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.configOpen}>
                    <DialogTitle id="simple-dialog-title">Serialize/Deserialize</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Set the maximum number of songs emitted.
                        </DialogContentText>
                        <TextField
                            autoFocus={true}
                            margin="dense"
                            multiline={true}
                            label="Serialized Graph"
                            type="text"
                            disabled={true}
                            fullWidth={true}
                            rowsMax={10}
                            value={this.state.serializedGraph}
                        />
                        <TextField
                            autoFocus={true}
                            margin="dense"
                            multiline={true}
                            label="New Serialized Graph"
                            type="text"
                            fullWidth={true}
                            rowsMax={20}
                            rows={20}
                            onChange={this.handleChange}
                            value={this.state.newGraph}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSave} color="primary">
                            Set Graph
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    public handleChange(event: any) {
        this.setState({
            newGraph: event.target.value
        })
    }

    public handleClose() {
        this.setState({
            configOpen: false
        });
    }

    public handleOpen() {
        this.setState({
            configOpen: true,
            serializedGraph: JSON.stringify(this.model.serializeDiagram(), null, 2)
        });
    }

    public handleSave() {
        this.model.deSerializeDiagram(JSON.parse(this.state.newGraph), this.engine);
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
