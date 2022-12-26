import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

interface IAlbumProps {
  album: {
    name: string;
    image: {
      url: string;
    };
    id: string;
    artists: Array<{ id: string; name: string }>;
  };
  handleClose: (selection: any) => any;
}

export class AlbumItem extends React.Component<IAlbumProps> {
  constructor(props: IAlbumProps) {
    super(props);
    this.state = {};

    this.close = this.close.bind(this);
  }

  public render() {
    return (
      <ListItem button={true} onClick={this.close}>
        <Avatar alt={this.props.album.name} src={this.props.album.image.url} />
        <ListItemText
          primary={this.props.album.name}
          secondary={
            "Album by " +
            this.props.album.artists.map((artist) => artist.name).join(", ")
          }
        />
      </ListItem>
    );
  }

  private close() {
    this.props.handleClose(this.props.album);
  }
}
