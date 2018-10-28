import {withStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {StyleRules} from "@material-ui/core/styles/withStyles";
import Add from "@material-ui/icons/Add";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck";
import SaveIcon from "@material-ui/icons/Save";
import TextFields from "@material-ui/icons/TextFields";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
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
    addNodeOpen: boolean;
    name: string;
    description: string;
    uri?: string;
    speedDialOpen: boolean;
    keyupListener: any;
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
            addNodeOpen: false,
            configOpen: false,
            description: "",
            keycloak: (window as any).keycloak,
            keyupListener: undefined,
            loginSpotifyOpen: false,
            name: "",
            saveOpen: false,
            speedDialOpen: false,
            uri: undefined,
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
        this.handleOpenAddNode = this.handleOpenAddNode.bind(this);
        this.handleSpeedDialOpen = this.handleSpeedDialOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseDial = this.handleCloseDial.bind(this);
        this.handleSaveClose = this.handleSaveClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
    }

    public componentWillMount() {
        const keyupListener = window.addEventListener("keyup", (event) => {
            if (event.altKey === true && event.key === "N") {
                this.handleOpenAddNode();
            }
        });

        this.setState({
            keyupListener,
        });
    }

    public componentWillUnmount() {
        window.removeEventListener("keyup", this.state.keyupListener);
        this.setState({
            keyupListener: undefined,
        });
    }

    public render() {
        return (
            <div className="editor">
                <Graph engine={this.engine}/>
                <AddNodesElement
                    engine={this.engine}
                    model={this.model}
                    className={this.props.classes.fab}
                    open={this.state.addNodeOpen}
                    onClose={this.handleClose}
                />
                <SpeedDial
                    ariaLabel="SpeedDial example"
                    className={this.props.classes.speedDial}
                    icon={<SpeedDialIcon />}
                    onBlur={this.handleCloseDial}
                    onClick={this.handleSpeedDialOpen}
                    onClose={this.handleCloseDial}
                    onFocus={this.handleSpeedDialOpen}
                    onMouseEnter={this.handleSpeedDialOpen}
                    onMouseLeave={this.handleCloseDial}
                    open={this.state.speedDialOpen}
                    direction={"up"}
                >
                    <SpeedDialAction
                        icon={<SaveIcon/>}
                        tooltipTitle={"Save graph"}
                        onClick={this.savePlaylist}
                    />
                    <SpeedDialAction
                        icon={<PlaylistAddCheck/>}
                        tooltipTitle={"Save to Spotify"}
                        onClick={this.saveToSpotify}
                    />
                    <SpeedDialAction
                        icon={<TextFields/>}
                        tooltipTitle={"Serialization"}
                        onClick={this.handleOpen}
                    />
                    <SpeedDialAction
                        icon={<Add/>}
                        tooltipTitle={"Add Node ([Alt]+[Shift]+N)"}
                        onClick={this.handleOpenAddNode}
                    />
                </SpeedDial>
                <SerializationDialog
                    model={this.model}
                    onSave={this.handleSave}
                    onClose={this.handleClose}
                    configOpen={this.state.configOpen}
                />
                <SaveDialog
                    model={this.model}
                    open={this.state.saveOpen}
                    onClose={this.handleSaveClose}
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
                uri: playlist.uri,
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

    public handleOpenAddNode() {
        this.setState({
            addNodeOpen: true,
        });
    }

    public handleSpeedDialOpen() {
        this.setState({
            speedDialOpen: true,
        });
    }

    public savePlaylist() {
        this.setState({
            saveOpen: true,
            speedDialOpen: false,
        });
    }

    public handleClose() {
        this.setState({
            addNodeOpen: false,
            configOpen: false,
            saveOpen: false,
            speedDialOpen: false,
        });
    }

    public handleCloseDial() {
        this.setState({
            speedDialOpen: false,
        });
    }

    public handleSaveClose(name: string, description: string) {
        this.setState({
            description,
            name,
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
        this.handleClose();

        if (!await User.connectedToSpotify()) {
            this.connectSpotify();
        }

        const data = JSON.stringify({
            description: this.state.description,
            graph: this.model.serializeDiagram(),
            name: this.state.name,
            saveToDatabase: true,
            uri: this.state.uri,
        });
        logger.info(data);

        const response = await axios.post(`${process.env.REACT_APP_API_BASE}/saveToSpotify`, data);
        try {
            logger.info(JSON.parse(response.data));
            this.setState({
                uri: JSON.parse(response.data).playlistUri,
            });
            alert("Success!");
        } catch (error) {
            logger.error(error);
            alert("Could not save.");
        }
    }
}

function styles(theme: Theme): StyleRules {
    return {
        fab: {
            bottom: theme.spacing.unit * 2,
            position: "absolute",
            right: theme.spacing.unit * 5,
        },
        speedDial: {
            bottom: theme.spacing.unit * 2,
            position: "absolute",
            right: theme.spacing.unit * 3,
        },
    };
}

export default withStyles(styles, {withTheme: true})(Editor);
