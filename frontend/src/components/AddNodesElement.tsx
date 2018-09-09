import Button from '@material-ui/core/Button';
import * as React from "react";
import * as SRD from "storm-react-diagrams";
import AddNodeModel from "../nodes/AddNode/AddNodeModel";
import LimitNodeModel from "../nodes/LimitNode/LimitNodeModel";
import PlaylistNodeModel from "../nodes/PlaylistNode/PlaylistNodeModel";
import RandomizeNodeModel from "../nodes/RandomizeNode/RandomizeNodeModel";
import SubtractNodeModel from "../nodes/SubtractNode/SubtractNodeModel";

interface IAddNodesElementProps {
    engine: SRD.DiagramEngine;
    model: SRD.DiagramModel;
}

export class AddNodesElement extends React.Component<IAddNodesElementProps> {
    constructor(props: IAddNodesElementProps) {
        super(props);
        this.state = {};

        this.addPlaylistNode = this.addPlaylistNode.bind(this);
        this.addAddNode = this.addAddNode.bind(this);
        this.addLimitNode = this.addLimitNode.bind(this);
        this.addRandomizeNode = this.addRandomizeNode.bind(this);
        this.addSubtractNode = this.addSubtractNode.bind(this);
    }

    public render() {
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.addPlaylistNode}>Add a PlaylistNode</Button>
                <Button variant="contained" color="primary" onClick={this.addAddNode}>Add an AddNode</Button>
                <Button variant="contained" color="primary" onClick={this.addSubtractNode}>Add a SubtractNode</Button>
                <Button variant="contained" color="primary" onClick={this.addLimitNode}>Add a LimitNode</Button>
                <Button variant="contained" color="primary" onClick={this.addRandomizeNode}>Add a RandomizeNode</Button>
            </div>);
    }

    public addPlaylistNode() {
        const node = PlaylistNodeModel.getInstance();
        node.setPosition(0, 0);

        this.props.model.addAll(node);
        this.props.engine.repaintCanvas();
    }

    public addAddNode() {
        const node = AddNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }

    public addSubtractNode() {
        const node = SubtractNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }

    public addLimitNode() {
        const node = LimitNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }

    public addRandomizeNode() {
        const node = RandomizeNodeModel.getInstance();
        node.setPosition(50, 10);

        this.props.model.addNode(node);
        this.props.engine.repaintCanvas();
    }
}