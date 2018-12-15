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
import * as React from "react";
import {Redirect} from "react-router";
import * as spotifyUri from "spotify-uri";
import * as SRD from "storm-react-diagrams";
import * as logger from "winston";
import Graph from "../components/Graph";
import {SaveDialog} from "../components/SaveDialog";
import {SerializationDialog} from "../components/SerializationDialog";
import "./Editor.css";

import AddNodeFactory from "../nodes/AddNode/AddNodeFactory";
import AlbumNodeFactory from "../nodes/AlbumNode/AlbumNodeFactory";
import LimitNodeFactory from "../nodes/LimitNode/LimitNodeFactory";
import MyLibraryNodeFactory from "../nodes/MyLibraryNode/MyLibraryNodeFactory";
import MyTopTracksNodeFactory from "../nodes/MyTopTracksNode/MyTopTracksNodeFactory";
import PlaylistNodeFactory from "../nodes/PlaylistNode/PlaylistNodeFactory";
import RandomizeNodeFactory from "../nodes/RandomizeNode/RandomizeNodeFactory";
import SubtractNodeFactory from "../nodes/SubtractNode/SubtractNodeFactory";

import AbstractPortFactory from "../nodes/AbstractPortFactory";
import DefaultPortFactory from "../nodes/DefaultPortFactory";
import LimitPortFactory from "../nodes/LimitNode/LimitPortFactory";

import {AddNodesElement} from "../components/AddNodesElement";
import AddNodeModel from "../nodes/AddNode/AddNodeModel";
import AlbumNodeModel from "../nodes/AlbumNode/AlbumNodeModel";
import PlaylistNodeModel from "../nodes/PlaylistNode/PlaylistNodeModel";

import * as _ from "lodash";
import * as api from "../api";
import RandomizePortFactory from "../nodes/RandomizeNode/RandomizePortFactory";
import SubtractPortFactory from "../nodes/SubtractNode/SubtractPortFactory";

interface IEditorState {
    configOpen: boolean;
    loginSpotifyOpen: boolean;
    saveOpen: boolean;
    addNodeOpen: boolean;
    name: string;
    description: string;
    uri?: string;
    speedDialOpen: boolean;
    keyupListener: any;
    keydownListener: any;
    mouseDown: boolean;
    redirect?: string;
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
            keydownListener: undefined,
            keyupListener: undefined,
            loginSpotifyOpen: false,
            mouseDown: false,
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
        engine.registerNodeFactory(new MyLibraryNodeFactory());

        engine.registerPortFactory(new AbstractPortFactory());
        engine.registerPortFactory(new DefaultPortFactory());
        engine.registerPortFactory(new LimitPortFactory());
        engine.registerPortFactory(new RandomizePortFactory());
        engine.registerPortFactory(new SubtractPortFactory());

        const model = new SRD.DiagramModel();
        this.model = model;

        engine.setDiagramModel(model);
        this.engine = engine;

        this.saveToSpotify = this.saveToSpotify.bind(this);

        this.handleOpen = this.handleOpen.bind(this);
        this.handleOpenAddNode = this.handleOpenAddNode.bind(this);
        this.handleSpeedDialOpen = this.handleSpeedDialOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseDial = this.handleCloseDial.bind(this);
        this.handleSaveClose = this.handleSaveClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.cloneSelected = this.cloneSelected.bind(this);
        this.updateLinks = this.updateLinks.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
    }

    public componentWillMount() {
        window.addEventListener("mousedown", (event) => {
            this.setState({
                mouseDown: true,
            });
        });

        window.addEventListener("mouseup", (event) => {
            this.setState({
                mouseDown: false,
            });
        });

        window.addEventListener("mousemove", (event) => {
            if (this.state.mouseDown) {
                this.updateLinks();
            }
        });

        const keyupListener = window.addEventListener("keyup", (event) => {
            event.preventDefault();
            if (event.altKey === true && event.key === "A") {
                this.handleOpenAddNode();
            }

            if (event.altKey === true && event.key === "S") {
                this.savePlaylist();
            }

            if (event.altKey === true && event.key === "D") {
                this.cloneSelected();
            }

            if (!event.ctrlKey && event.key === "Control") {
                this.model.setGridSize();
            }

            if (event.ctrlKey && event.key === "Shift") {
                this.model.setGridSize(30);
            }
        });

        const keydownListener = window.addEventListener("keydown", (event) => {
            if (event.ctrlKey) {
                this.model.setGridSize(30);
            }

            if (event.ctrlKey && event.shiftKey) {
                this.model.setGridSize(10);
            }
        });

        this.setState({
            keydownListener,
            keyupListener,
        });
    }

    public componentWillUnmount() {
        window.removeEventListener("keyup", this.state.keyupListener);
        window.removeEventListener("keydown", this.state.keydownListener);
        this.setState({
            keydownListener: undefined,
            keyupListener: undefined,
        });
    }

    public render() {
        if (this.state.redirect) {
            return (<Redirect to={this.state.redirect}/>);
        }

        return (
            <div className="editor" onDrop={this.handleDrop} onDragOver={this.handleDragOver}>
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
                        tooltipTitle={"Save graph ([Alt]+[Shift]+S)"}
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
                        tooltipTitle={"Add Node ([Alt]+[Shift]+A)"}
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
        if (sessionStorage.getItem("loggedIn") !== "true") {
            this.setState({
                redirect: "/login",
            });
        }

        try {
            const id = this.props.match.params.id;
            if (id) {
                const playlist = await api
                    .MeApiFp()
                    .getMyPlaylistById(id, {credentials: "include"})();
                this.setState({
                    description: playlist.description,
                    name: playlist.name,
                    uri: playlist.uri,
                });
                this.model.deSerializeDiagram(playlist.graph, this.engine);
                this.engine.repaintCanvas();
            } else {
                this.addDefaultNodes();
            }
        } catch (error) {
            if (error.status === 401) {
                this.setState({
                    redirect: "/login",
                });
            }
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
        this.model.clearSelection();
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

    private handleDrop(event: any) {
        //tslint:disable
        event.preventDefault();
        if(event.dataTransfer.types.includes("text/x-spotify-data-log-context")) {
            const links = event.dataTransfer.getData("text/plain").split("\n");
            const spotifyObjects = links.map((link: any) => spotifyUri.parse(link));
            spotifyObjects.forEach((track: spotifyUri.IParsedSpotifyUri) => {
                if(track.type === "playlist") {

                    const node = PlaylistNodeModel.getInstance();

                    this.model.addNode(node);
                    this.engine.repaintCanvas();

                    node.configuration.id = track.id;
                    node.configuration.userId = track.user;
                    const firstChild: any = new DOMParser().parseFromString(event.dataTransfer.getData('text/html'), 'text/xml').firstChild;
                    if(firstChild) {
                        node.name = `Playlist '${firstChild.innerHTML}'`;
                    }
                }

                if(track.type === "album") {

                    const node = AlbumNodeModel.getInstance();

                    this.model.addNode(node);
                    this.engine.repaintCanvas();

                    node.configuration.id = track.id;
                    const firstChild: any = new DOMParser().parseFromString(event.dataTransfer.getData('text/html'), 'text/xml').firstChild;
                    if(firstChild) {
                        node.name = `Album '${firstChild.innerHTML}'`;
                    }
                }
            });
        }
    }

    private handleDragOver(event: any) {
        event.preventDefault();
    }

    private updateLinks() {
        _.forEach(this.model.links, (link) => {
            if (link.getSourcePort()) {
                link.getFirstPoint().updateLocation(this.engine.getPortCenter(link.getSourcePort()));
            }

            if (link.getTargetPort()) {
                link.getLastPoint().updateLocation(this.engine.getPortCenter(link.getTargetPort()));
            }
        });
    }

    private cloneSelected() {
        const offset = { x: 100, y: 100 };

        const itemMap = {};
        const items: any[] = [];
        _.forEach(this.model.getSelectedItems(), (item: SRD.BaseModel<any>) => {
            const newItem = item.clone(itemMap);

            // offset the nodes slightly
            if (newItem instanceof SRD.NodeModel) {
                newItem.setPosition(newItem.x + offset.x, newItem.y + offset.y);
                this.model.addNode(newItem);
            } else if (newItem instanceof SRD.LinkModel) {
                // offset the link points
                newItem.getPoints().forEach((p) => {
                    p.updateLocation({ x: p.getX() + offset.x, y: p.getY() + offset.y });
                });
                this.model.addLink(newItem);
            }
            newItem.selected = false;
            items.push(newItem);
        });

        this.model.clearSelection();
        _.forEach(items, (item: SRD.BaseModel<any>) => item.selected = true);

        this.forceUpdate();
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
        this.handleClose();

        try {
            const response = await api.MeApiFp().addPlaylist({
                description: this.state.description,
                graph: this.model.serializeDiagram(),
                name: this.state.name,
                saveToSpotify: true,
                uri: this.state.uri,
            }, {credentials: "include"})();
            try {
                logger.info(response);
                this.setState({
                    uri: response.playlistUri,
                });
                alert("Success!");
            } catch (error) {
                logger.error(error);
                alert("Could not save.");
                if (error.status === 401) {
                    this.setState({
                        redirect: "/login",
                    });
                }
            }
        } catch (error) {
            if (error.status === 401) {
                this.setState({
                    redirect: "/login",
                });
            }
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
