import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';

interface IPlaylistProps {
  playlist: {
    name: string;
    image?: {
      url: string;
    };
    userId: string;
    id: string;
  };
  handleClose: (selection: any) => any;
}

export class SearchPlaylistItem extends React.Component<IPlaylistProps> {
  constructor(props: IPlaylistProps) {
    super(props);
    this.state = {};

    this.close = this.close.bind(this);
  }

  public render() {
    return (
      <ListItem button={true} onClick={this.close}>
        <Avatar
          alt={this.props.playlist.name}
          src={this.props.playlist.image ? this.props.playlist.image.url : ''}
        />
        <ListItemText primary={this.props.playlist.name} />
      </ListItem>
    );
  }

  private close() {
    this.props.handleClose(this.props.playlist);
  }
}
