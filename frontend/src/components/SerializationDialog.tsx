import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import * as SRD from 'storm-react-diagrams';

interface ISerializationDialog {
  model: SRD.DiagramModel;
  configOpen: boolean;
  onClose: () => any;
  onSave: (graph: string) => any;
}

export class SerializationDialog extends React.Component<ISerializationDialog> {
  public state: {
    newGraph: string;
    serializedGraph: string;
  };

  constructor(props: ISerializationDialog) {
    super(props);
    this.state = {
      newGraph: '',
      serializedGraph: '',
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
        // todo
        // onEnter={this.handleEnter}
      >
        <DialogTitle id="simple-dialog-title">
          Serialize/Deserialize
        </DialogTitle>
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
            // todo
            // rowsMax={10}
            value={this.state.serializedGraph}
          />
          <TextField
            autoFocus={true}
            margin="dense"
            multiline={true}
            label="New Serialized Graph"
            type="text"
            fullWidth={true}
            // todo
            // rowsMax={20}
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
      serializedGraph: JSON.stringify(
        this.props.model.serializeDiagram(),
        null,
        2,
      ),
    });
  }

  private handleSave() {
    this.props.onSave(this.state.newGraph);
  }
}
