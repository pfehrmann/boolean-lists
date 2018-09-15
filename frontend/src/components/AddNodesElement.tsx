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
    className: any;
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

        this.addNode = this.addNode.bind(this);

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    public render() {
        return (
            <div className={this.props.className}>
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
                    <MenuItem onClick={this.addNode(PlaylistNodeModel.getInstance)}>Add a PlaylistNode</MenuItem>
                    <MenuItem onClick={this.addNode(AddNodeModel.getInstance)}>Add an AddNode</MenuItem>
                    <MenuItem onClick={this.addNode(SubtractNodeModel.getInstance)}>Add a SubtractNode</MenuItem>
                    <MenuItem onClick={this.addNode(LimitNodeModel.getInstance)}>Add a LimitNode</MenuItem>
                    <MenuItem onClick={this.addNode(RandomizeNodeModel.getInstance)}>Add a RandomizeNode</MenuItem>
                    <MenuItem onClick={this.addNode(MyTopTracksNodeModel.getInstance)}>Add a MyTopTracksNode</MenuItem>
                    <MenuItem onClick={this.addNode(AlbumNodeModel.getInstance)}>Add a AlbumNode</MenuItem>
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

    public addNode(nodeFunction: () => SRD.NodeModel): () => any {
        return () => {
            this.handleClose();
            const node = nodeFunction();
            node.setPosition(50, 10);

            this.props.model.addNode(node);
            this.props.engine.repaintCanvas();
        }
    }
}