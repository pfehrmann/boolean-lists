import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import * as SRD from "storm-react-diagrams";
import * as User from "../api/User";

interface ISerializationDialog {
    model: SRD.DiagramModel;
    open: boolean;
    onClose: () => any;
    name: string;
    description: string;
}

export class SaveDialog extends React.Component<ISerializationDialog> {
    public state: {
        description: string,
        name: string
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
    }

    public render() {
        return (<Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.props.open}>
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
                    value={this.props.description}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.handleSave} color="primary">
                    Set Graph
                </Button>
            </DialogActions>
        </Dialog>);
    }

    private handleChange(event: any) {
        this.setState({[event.target.name]: event.target.value});
    }

    private handleClose() {
        this.props.onClose();
    }

    private handleSave() {
        User.addPlaylist({
            description: this.state.description,
            graph: JSON.stringify(this.props.model.serializeDiagram()),
            name: this.state.name
        })
    }
}