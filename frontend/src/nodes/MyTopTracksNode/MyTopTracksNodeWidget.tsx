import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import * as React from "react";
import * as SRD from "storm-react-diagrams";

import {AbstractNodeWidget, IAbstractNodeProps} from "../AbstractNodeWidget";
import MyTopTracksNodeModel from "./MyTopTracksNodeModel";

export interface IMyTopTracksNodeProps extends IAbstractNodeProps<MyTopTracksNodeModel> {
    node: MyTopTracksNodeModel;
    diagramEngine: SRD.DiagramEngine;
}

interface IMyTopTracksNodeState {
    configOpen: boolean;
    timeRange: string;
    oldTimeRange: string;
}

export default class MyTopTracksNodeWidget extends AbstractNodeWidget<IMyTopTracksNodeProps> {
    private static stopPropagation(event: any) {
        event.stopPropagation();
    }

    public state: IMyTopTracksNodeState;

    constructor(props: IMyTopTracksNodeProps) {
        super("my-top-tracks-node", props);

        this.state = {
            configOpen: false,
            oldTimeRange: "medium_term",
            timeRange: "medium_term"
        };

        this.render = this.render.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (<div>
            {super.render()}
            <Dialog onClose={this.handleSave} aria-labelledby="simple-dialog-title" open={this.state.configOpen}
                    onKeyUp={MyTopTracksNodeWidget.stopPropagation} onDrag={MyTopTracksNodeWidget.stopPropagation}
                    onScroll={MyTopTracksNodeWidget.stopPropagation}>
                <DialogTitle id="simple-dialog-title">Select time range</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select the time range for your top tracks.
                    </DialogContentText>
                    <InputLabel htmlFor="time-range">Time Range</InputLabel>
                    <Select
                        autoFocus={true}
                        margin="dense"
                        type="number"
                        inputProps={{
                            id: 'time-range',
                            name: 'timeRange',
                        }}
                        fullWidth={true}
                        value={this.state.timeRange}
                        onChange={this.handleChange}
                    >
                        <MenuItem value={"short_term"}>Short term</MenuItem>
                        <MenuItem value={"medium_term"}>Medium term</MenuItem>
                        <MenuItem value={"long_term"}>Long term</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>)
    }

    public onDoubleClick() {
        this.setState({
            configOpen: true
        });
    }

    private handleChange (event: any) {
        this.setState({ [event.target.name]: event.target.value });
    };

    private handleSave() {
        this.setState({
            configOpen: false,
            oldTimeRange: this.state.timeRange
        });
        this.props.node.configuration.timeRange = this.state.timeRange;
    }

    private handleCancel() {
        this.setState({
            configOpen: false,
            timeRange: this.state.oldTimeRange
        })
    }
}
