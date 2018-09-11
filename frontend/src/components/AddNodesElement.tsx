import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import * as React from "react";
import * as SRD from "storm-react-diagrams";

import AddNodeModel from "../nodes/AddNode/AddNodeModel";
import AlbumNodeModel from "../nodes/AlbumNode/AlbumNodeModel";
import LimitNodeModel from "../nodes/LimitNode/LimitNodeModel";
import MyTopTracksNodeModel from "../nodes/MyTopTracksNode/MyTopTracksNodeModel";
import PlaylistNodeModel from "../nodes/PlaylistNode/PlaylistNodeModel";
import RandomizeNodeModel from "../nodes/RandomizeNode/RandomizeNodeModel";
import SubtractNodeModel from "../nodes/SubtractNode/SubtractNodeModel";

interface IAddNodesElementProps {
    engine: SRD.DiagramEngine;
    model: SRD.DiagramModel;
}

interface IAddNodesElementState {
    anchorEl: any;
}

export class AddNodesElement extends React.Component<IAddNodesElementProps> {
    public state: IAddNodesElementState;

    constructor(props: IAddNodesElementProps) {
        super(props);
        this.state = {
            anchorEl: undefined
        };

        this.addPlaylistNode = this.addPlaylistNode.bind(this);
        this.addAddNode = this.addAddNode.bind(this);
        this.addLimitNode = this.addLimitNode.bind(this);
        this.addRandomizeNode = this.addRandomizeNode.bind(this);
        this.addSubtractNode = this.addSubtractNode.bind(this);
        this.addMyTopTracksNode = this.addMyTopTracksNode.bind(this);
        this.addAlbumNode = this.addAlbumNode.bind(this);

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    public render() {
        return (
            <div>
                <Button
                    variant="fab"
                    color="primary"
                    aria-label="Add"
                    aria-owns={this.state.anchorEl ? "add-node-menu" : undefined}
                    aria-haspopup={true}
                    onClick={this.handleClick}
                >
                    <AddIcon/>
                </Button>
                <Menu
                    id={"add-node-menu"}
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.addPlaylistNode}>Add a PlaylistNode</MenuItem>
                    <MenuItem onClick={this.addAddNode}>Add an AddNode</MenuItem>
                    <MenuItem onClick={this.addSubtractNode}>Add a SubtractNode</MenuItem>
                    <MenuItem onClick={this.addLimitNode}>Add a LimitNode</MenuItem>
                    <MenuItem onClick={this.addRandomizeNode}>Add a RandomizeNode</MenuItem>
                    <MenuItem onClick={this.addMyTopTracksNode}>Add a MyTopTracksNode</MenuItem>
                    <MenuItem onClick={this.addAlbumNode}>Add a AlbumNode</MenuItem>
                </Menu>
            </div>
        );
    }

    public handleClick(event: any) {
        this.setState({ anchorEl: event.currentTarget });
    };

    public handleClose() {
        this.setState({ anchorEl: undefined });
    };

    public addPlaylistNode() {
        this.handleClose();
        const node = PlaylistNodeModel.getInstance();
        node.setPosition(0, 0);

        this.props.model.addAll(node);
        this.props.engine.repaintCanvas();
    }

    public addAddNode() {
        this.handleClose();
        const node = AddNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }

    public addSubtractNode() {
        this.handleClose();
        const node = SubtractNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }

    public addLimitNode() {
        this.handleClose();
        const node = LimitNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }

    public addRandomizeNode() {
        this.handleClose();
        const node = RandomizeNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }

    public addMyTopTracksNode() {
        this.handleClose();
        const node = MyTopTracksNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }

    public addAlbumNode() {
        this.handleClose();
        const node = AlbumNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }
}