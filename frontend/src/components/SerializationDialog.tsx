import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import * as SRD from "storm-react-diagrams";

interface ISerializationDialog {
    model: SRD.DiagramModel;
    configOpen: boolean;
    onClose: () => any;
    onSave: (graph: string) => any;
}

export class SerializationDialog extends React.Component<ISerializationDialog> {
    public state: {
        newGraph: string,
        serializedGraph: string,
    };

    constructor(props: ISerializationDialog) {
        super(props);
        this.state = {
            newGraph: "",
            serializedGraph: "",
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <Dialog
                onClose={this.handleClose}
                aria-labelledby="simple-dialog-title"
                open={this.props.configOpen}
                onEnter={this.handleEnter}
            >
                <DialogTitle id="simple-dialog-title">Serialize/Deserialize</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Set the maximum number of songs emitted.
                    </DialogContentText>
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        multiline={true}
                        label="Serialized Graph"
                        type="text"
                        disabled={true}
                        fullWidth={true}
                        rowsMax={10}
                        value={this.state.serializedGraph}
                    />
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        multiline={true}
                        label="New Serialized Graph"
                        type="text"
                        fullWidth={true}
                        rowsMax={20}
                        rows={20}
                        onChange={this.handleChange}
                        value={this.state.newGraph}
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
            </Dialog>
        );
    }

    private handleChange(event: any) {
        this.setState({
            newGraph: event.target.value,
        });
    }

    private handleClose() {
        this.props.onClose();
    }

    private handleEnter() {
        this.setState({
            serializedGraph: JSON.stringify(this.props.model.serializeDiagram(), null, 2),
        });
    }

    private handleSave() {
        this.props.onSave(this.state.newGraph);
    }
}
