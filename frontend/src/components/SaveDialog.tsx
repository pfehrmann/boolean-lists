import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import {Redirect} from "react-router";
import * as SRD from "storm-react-diagrams";

import * as api from "../api";

interface ISerializationDialog {
    model: SRD.DiagramModel;
    open: boolean;
    onClose: (name: string, description: string) => any;
    name: string;
    description: string;
}

export class SaveDialog extends React.Component<ISerializationDialog> {
    public state: {
        description: string,
        name: string,
        redirect?: string,
    };

    constructor(props: ISerializationDialog) {
        super(props);
        this.state = {
            description: props.name,
            name: props.description,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    public render() {
        if (this.state.redirect) {
            return (<Redirect to={this.state.redirect}/>);
        }

        return (
            <Dialog
                onClose={this.handleClose}
                aria-labelledby="simple-dialog-title"
                open={this.props.open}
                onEnter={this.handleOpen}
            >
                <DialogTitle id="simple-dialog-title">Save BooleanList</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Save your BooleanList to your account so you can retrieve it later.
                    </DialogContentText>
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth={true}
                        inputProps={{name: "name"}}
                        onChange={this.handleChange}
                        value={this.state.name}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth={true}
                        inputProps={{name: "description"}}
                        onChange={this.handleChange}
                        value={this.state.description}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSave} color="primary">
                        Save BooleanList
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    private handleChange(event: any) {
        this.setState({[event.target.name]: event.target.value});
    }

    private handleClose() {
        this.props.onClose(this.state.name, this.state.description);
    }

    private handleOpen() {
        if (!this.state.name) {
            this.setState({
                name: this.props.name,
            });
        }

        if (!this.state.description) {
            this.setState({
                description: this.props.description,
            });
        }
    }

    private async handleSave() {
        try {
            await api.MeApiFp((window as any).config).addPlaylist({
                description: this.state.description,
                graph: this.props.model.serializeDiagram(),
                name: this.state.name,
            }, {credentials: "include"})();
            this.handleClose();
        } catch (error) {
            if (error.status === 401) {
                this.setState({
                    redirect: "/login",
                });
            }
        }
    }
}
