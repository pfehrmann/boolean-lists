import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';

interface IArtistProps {
  artist: {
    name: string;
    image: {
      url: string;
    };
    id: string;
  };
  handleClose: (selection: any) => any;
}

export class ArtistItem extends React.Component<IArtistProps> {
  constructor(props: IArtistProps) {
    super(props);
    this.state = {};

    this.close = this.close.bind(this);
  }

  public render() {
    return (
      <ListItem button={true} onClick={this.close}>
        <Avatar
          alt={this.props.artist.name}
          src={this.props.artist.image.url}
        />
        <ListItemText primary={this.props.artist.name} />
      </ListItem>
    );
  }

  private close() {
    this.props.handleClose(this.props.artist);
  }
}
