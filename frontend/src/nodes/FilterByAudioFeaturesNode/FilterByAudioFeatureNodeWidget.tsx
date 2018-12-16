import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import * as SRD from "storm-react-diagrams";

import {AbstractNodeWidget, IAbstractNodeProps} from "../AbstractNodeWidget";
import FilterByAudioFeatureNodeModel from "./FilterByAudioFeatureNodeModel";

export interface IFilterByAudioFeatureNodeProps extends IAbstractNodeProps<FilterByAudioFeatureNodeModel> {
    node: FilterByAudioFeatureNodeModel;
    diagramEngine: SRD.DiagramEngine;
}

interface IFilterByAudioFeatureNodeState {
    configOpen: boolean;
    from: number;
    oldFrom: number;
    to: number;
    oldTo: number;
    feature: string;
    oldFeature: string;
}

export default class FilterByAudioFeatureNodeWidget extends AbstractNodeWidget<IFilterByAudioFeatureNodeProps> {
    private static stopPropagation(event: any) {
        event.stopPropagation();
    }

    public state: IFilterByAudioFeatureNodeState;

    constructor(props: IFilterByAudioFeatureNodeProps) {
        super("filter-by-audio-features-node", props);

        this.state = {
            configOpen: props.configOpen,
            feature: this.props.node.configuration.feature || "tempo",
            from: this.props.node.configuration.from || 120,
            oldFeature: this.props.node.configuration.feature || "tempo",
            oldFrom: this.props.node.configuration.from || 120,
            oldTo: this.props.node.configuration.to || 130,
            to: this.props.node.configuration.to || 130,
        };

        this.render = this.render.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <div>
                {super.render()}
                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="simple-dialog-title"
                    open={this.state.configOpen}
                    onKeyUp={FilterByAudioFeatureNodeWidget.stopPropagation}
                    onDrag={FilterByAudioFeatureNodeWidget.stopPropagation}
                    onScroll={FilterByAudioFeatureNodeWidget.stopPropagation}
                >
                    <DialogTitle id="simple-dialog-title">Select limit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Set the filter features
                        </DialogContentText>
                        <TextField
                            autoFocus={true}
                            margin="dense"
                            inputProps={{ id: "from", name: "from" }}
                            label="From"
                            type="number"
                            fullWidth={true}
                            value={this.state.from}
                            onChange={this.handleChange}
                        />
                        <TextField
                            autoFocus={true}
                            margin="dense"
                            inputProps={{ id: "to", name: "to" }}
                            label="To"
                            type="number"
                            fullWidth={true}
                            value={this.state.to}
                            onChange={this.handleChange}
                        />
                        <InputLabel htmlFor="feature">Time Range</InputLabel>
                        <Select
                            autoFocus={true}
                            margin="dense"
                            type="text"
                            inputProps={{ id: "feature", name: "feature" }}
                            fullWidth={true}
                            value={this.state.feature}
                            onChange={this.handleChange}
                        >
                            <MenuItem value={"danceability"}>Danceability</MenuItem>
                            <MenuItem value={"energy"}>Energy</MenuItem>
                            <MenuItem value={"tempo"}>Tempo</MenuItem>
                            <MenuItem value={"valence"}>Valence</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    public onDoubleClick() {
        this.setState({
            configOpen: true,
        });
    }

    private handleChange(event: any) {
        // TODO: Use proper validation
        // tslint:disable
        console.log(event);

        let update: any = {};
        update[event.target.name] = event.target.value;
        this.setState(update);
    }

    private handleClose() {
        this.setState({
            configOpen: false,
            oldFeature: this.state.feature,
            oldFrom: this.state.from,
            oldTo: this.state.to,
        });
        this.props.node.configuration.feature = this.state.feature;
        this.props.node.configuration.from = this.state.from;
        this.props.node.configuration.to = this.state.to;
    }

    private handleCancel() {
        this.setState({
            configOpen: false,
            feature: this.state.oldFeature,
            from: this.state.oldFrom,
            to: this.state.oldTo,
        });
    }
}
