import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import * as SRD from "storm-react-diagrams";

import {AbstractNodeWidget, IAbstractNodeProps} from "../AbstractNodeWidget";
import LimitNodeModel from "./LimitNodeModel";

export interface ILimitNodeProps extends IAbstractNodeProps<LimitNodeModel> {
    node: LimitNodeModel;
    diagramEngine: SRD.DiagramEngine;
}

interface ILimitNodeState {
    configOpen: boolean;
    limit: number;
    oldLimit: number;
}

export default class LimitNodeWidget extends AbstractNodeWidget<ILimitNodeProps> {
    private static stopPropagation(event: any) {
        event.stopPropagation();
    }

    public state: ILimitNodeState;

    constructor(props: ILimitNodeProps) {
        super("limit-node", props);

        this.state = {
            configOpen: false,
            limit: 20,
            oldLimit: 20,
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
                    onKeyUp={LimitNodeWidget.stopPropagation}
                    onDrag={LimitNodeWidget.stopPropagation}
                    onScroll={LimitNodeWidget.stopPropagation}
                >
                    <DialogTitle id="simple-dialog-title">Select limit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Set the maximum number of songs emitted.
                        </DialogContentText>
                        <TextField
                            autoFocus={true}
                            margin="dense"
                            inputProps={{min: 1}}
                            id="limit"
                            label="Limit"
                            type="number"
                            fullWidth={true}
                            value={this.state.limit}
                            onChange={this.handleChange}
                        />
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
        if (event.target.value && event.target.value < 1) {
            return;
        }

        this.setState({
            limit: event.target.value,
        });
    }

    private handleClose() {
        this.setState({
            configOpen: false,
            oldLimit: this.state.oldLimit,
        });
        this.props.node.configuration.limit = this.state.limit;
    }

    private handleCancel() {
        this.setState({
            configOpen: false,
            limit: this.state.limit,
        });
    }
}
