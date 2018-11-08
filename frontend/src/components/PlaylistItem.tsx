import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";
import {Link} from "react-router-dom";
import {Playlist} from "../api";

interface IPlaylistProps {
    playlist: Playlist;
    handleDelete: () => any;
}

export class PlaylistItem extends React.Component<IPlaylistProps> {
    constructor(props: IPlaylistProps) {
        super(props);
    }

    public render() {
        return (
            <ListItem>
                <Avatar src={this.props.playlist.image ? this.props.playlist.image.url : ""}/>
                <Link
                    to={`/editor/${this.props.playlist.name}`}
                    style={{textDecoration: "none"}}
                >
                    <IconButton>
                        <EditIcon color={"action"}/>
                    </IconButton>
                </Link>

                <ListItemText
                    primary={this.props.playlist.name}
                    secondary={this.props.playlist.description}
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={this.props.handleDelete}>
                        <DeleteIcon color={"error"}/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}
