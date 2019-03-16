import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";
import {Link} from "react-router-dom";
import {Playlist} from "../api";

import * as listIcon from "./list_icon.svg";

import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

function styles(theme: any) {
    return {
        card: {
            display: "flex",
        },
        content: {
            flex: "1 0 auto",
        },
        controls: {
            alignItems: "center",
            display: "flex",
            paddingBottom: theme.spacing.unit,
            paddingLeft: theme.spacing.unit,
        },
        cover: {
            height: 151,
            width: 151,
        },
        details: {
            display: "flex",
            flexDirection: "column",
        },
        playIcon: {
            height: 38,
            width: 38,
        },
    };
}

interface IPlaylistProps {
    playlist: Playlist;
    handleDelete?: () => any;
    classes: any;
    link?: string;
}

export class PlaylistItem extends React.Component<IPlaylistProps> {
    constructor(props: IPlaylistProps) {
        super(props);

        this.getDeleteButton = this.getDeleteButton.bind(this);
    }

    public render() {
        return (
            <Card className={this.props.classes.card}>
                <CardMedia
                    className={this.props.classes.cover}
                    image={this.props.playlist.image ? this.props.playlist.image.url : listIcon}
                    title={this.props.playlist.name}
                />

                <div className={this.props.classes.details}>
                    <CardContent className={this.props.classes.content}>
                        <Typography component="h5" variant="h5">
                            {this.props.playlist.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {this.props.playlist.description}
                        </Typography>
                    </CardContent>
                    <div className={this.props.classes.controls}>
                        {this.getDeleteButton()}
                        <Link
                            to={this.props.link || `/editor/${this.props.playlist.name}`}
                            style={{textDecoration: "none"}}
                        >
                            <IconButton>
                                <EditIcon color={"action"}/>
                            </IconButton>
                        </Link>
                    </div>
                </div>
            </Card>
        );
    }

    private getDeleteButton() {
        if (!this.props.handleDelete) {
            return null;
        }
        return (
            <IconButton aria-label="Delete" onClick={this.props.handleDelete}>
                <DeleteIcon color={"error"}/>
            </IconButton>
        );
    }
}

export default withStyles(styles as any, { withTheme: true })(PlaylistItem);
