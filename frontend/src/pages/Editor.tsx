import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {StyleRules} from "@material-ui/core/styles/withStyles";
import axios from "axios";
import * as Keycloak from "keycloak-js";
import * as React from "react";
import * as SRD from "storm-react-diagrams";
import * as logger from "winston";
import Graph from "../components/Graph";
import {SaveDialog} from "../components/SaveDialog";
import {SerializationDialog} from "../components/SerializationDialog";
import "./Editor.css";

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

import * as User from "../api/User";

interface IEditorState {
    configOpen: boolean;
    loginSpotifyOpen: boolean;
    keycloak: Keycloak.KeycloakInstance;
    saveOpen: boolean;
    name: string;
    description: string;
}

interface IEditorProps {
    match?: any;
    classes: any;
}

class Editor extends React.Component<IEditorProps> {
    public state: IEditorState;

    private readonly engine: SRD.DiagramEngine;
    private readonly model: SRD.DiagramModel;

    constructor(props: IEditorProps) {
        super(props);

        this.state = {
            configOpen: false,
            description: "",
            keycloak: (window as any).keycloak,
            loginSpotifyOpen: false,
            name: "",
            saveOpen: false,
        };

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

        engine.setDiagramModel(model);
        this.engine = engine;

        this.saveToSpotify = this.saveToSpotify.bind(this);

        this.connectSpotify = this.connectSpotify.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
    }

    public render() {
        return (
            <div className="editor">
                <div>
                    <Button variant="contained" color="primary" onClick={this.handleOpen}>Serialization</Button>
                    <Button variant="contained" color="primary" onClick={this.saveToSpotify}>Save to Spotify</Button>
                    <Button variant="contained" color="primary" onClick={this.connectSpotify}>Connect Spotify</Button>
                    <Button variant="contained" color="primary" onClick={this.savePlaylist}>Save BooleanList</Button>
                </div>
                <Graph engine={this.engine}/>
                <AddNodesElement engine={this.engine} model={this.model} className={this.props.classes.fab}/>
                <SerializationDialog
                    model={this.model}
                    onSave={this.handleSave}
                    onClose={this.handleClose}
                    configOpen={this.state.configOpen}
                />
                <SaveDialog
                    model={this.model}
                    open={this.state.saveOpen}
                    onClose={this.handleClose}
                    name={this.state.name}
                    description={this.state.description}
                />
            </div>
        );
    }

    public async componentDidMount() {
        if (!this.state.keycloak.authenticated) {
            this.state.keycloak.login().error(() => {
                alert("login failed.");
            });
        }

        const id = this.props.match.params.id;
        if (id) {
            const playlist = await User.playlist(id);
            this.setState({
                description: playlist.description,
                name: playlist.name,
            });
            this.model.deSerializeDiagram(JSON.parse(playlist.graph), this.engine);
            this.engine.repaintCanvas();
        } else {
            this.addDefaultNodes();
        }
    }

    public handleOpen() {
        this.setState({
            configOpen: true,
        });
    }

    public savePlaylist() {
        this.setState({
            saveOpen: true,
        });
    }

    public handleClose() {
        this.setState({
            configOpen: false,
            saveOpen: false,
        });
    }

    public handleSave(graph: string) {
        this.model.deSerializeDiagram(JSON.parse(graph), this.engine);
        this.setState({
            configOpen: false,
        });
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
        window.location.assign(`${process.env.REACT_APP_API_BASE}/auth/spotify/login` +
            `?url=${window.location.href}` +
            `&authorization=Bearer ${this.state.keycloak.token}`);
    }

    private async saveToSpotify() {
        const data = JSON.stringify(this.model.serializeDiagram());
        logger.info(data);

        const response = await axios.post(`${process.env.REACT_APP_API_BASE}/saveToSpotify`, data);
        try {
            logger.info(response.data);
        } catch (error) {
            logger.error(error);
        }
    }
}

function styles(theme: Theme): StyleRules {
    return {
        fab: {
            bottom: theme.spacing.unit * 2,
            position: "absolute",
            right: theme.spacing.unit * 2,
        },
    };
}

export default withStyles(styles, {withTheme: true})(Editor);
