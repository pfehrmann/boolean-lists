import * as React from "react";
import * as SRD from "storm-react-diagrams";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import AddNodeModel from "../nodes/AddNode/AddNodeModel";
import AlbumNodeModel from "../nodes/AlbumNode/AlbumNodeModel";
import LimitNodeModel from "../nodes/LimitNode/LimitNodeModel";
import MyTopTracksNodeModel from "../nodes/MyTopTracksNode/MyTopTracksNodeModel";
import PlaylistNodeModel from "../nodes/PlaylistNode/PlaylistNodeModel";
import RandomizeNodeModel from "../nodes/RandomizeNode/RandomizeNodeModel";
import SubtractNodeModel from "../nodes/SubtractNode/SubtractNodeModel";

import * as _ from "lodash";

interface IAddNodesElementProps {
    engine: SRD.DiagramEngine;
    model: SRD.DiagramModel;
    className: any;
    open: boolean;
    onClose: () => any;
}

interface IAddNodesElementState {
    lastMouseEvent: any;
}

export class AddNodesElement extends React.Component<IAddNodesElementProps> {
    public state: IAddNodesElementState;

    constructor(props: IAddNodesElementProps) {
        super(props);

        this.state = {
            lastMouseEvent: undefined,
        };

        this.addNode = this.addNode.bind(this);
    }

    public componentDidMount() {
        window.addEventListener("mousemove", (event) => {
            this.setState({
                lastMouseEvent: event,
            });
        });
    }

    public render() {
        return (
            <Dialog
                onClose={this.props.onClose}
                aria-labelledby="simple-dialog-title"
                open={this.props.open}
            >
                <DialogTitle id="simple-dialog-title">Save BooleanList</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add a node to the graph
                    </DialogContentText>
                    <List>
                        <ListItem button={true} onClick={this.addNode(PlaylistNodeModel.getInstance)}>
                            <ListItemText>Add a PlaylistNode</ListItemText>
                        </ListItem>
                        <ListItem button={true} onClick={this.addNode(AddNodeModel.getInstance)}>
                            <ListItemText>Add an AddNode</ListItemText>
                        </ListItem>
                        <ListItem button={true} onClick={this.addNode(SubtractNodeModel.getInstance)}>
                            <ListItemText>Add a SubtractNode</ListItemText>
                        </ListItem>
                        <ListItem button={true} onClick={this.addNode(LimitNodeModel.getInstance)}>
                            <ListItemText>Add a LimitNode</ListItemText>
                        </ListItem>
                        <ListItem button={true} onClick={this.addNode(RandomizeNodeModel.getInstance)}>
                            <ListItemText>Add a RandomizeNode</ListItemText>
                        </ListItem>
                        <ListItem button={true} onClick={this.addNode(MyTopTracksNodeModel.getInstance)}>
                            <ListItemText>Add a MyTopTracksNode</ListItemText>
                        </ListItem>
                        <ListItem button={true} onClick={this.addNode(AlbumNodeModel.getInstance)}>
                            <ListItemText>Add a AlbumNode</ListItemText>
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>
        );
    }

    public addNode(nodeFunction: () => SRD.NodeModel): () => any {
        return () => {
            this.props.onClose();
            const node = nodeFunction();
            (this.props.engine.getNodeFactory(node.getType()) as any).setConfigOpen(true);
            const position = this.props.engine.getRelativeMousePoint(this.state.lastMouseEvent);
            node.setPosition(position.x, position.y);

            this.props.model.addNode(node);
            this.props.model.clearSelection();
            node.setSelected(true);
            this.props.engine.repaintCanvas();

            _.delay(() => {
                (this.props.engine.getNodeFactory(node.getType()) as any).setConfigOpen(false);
            }, 100);
        };
    }
}
