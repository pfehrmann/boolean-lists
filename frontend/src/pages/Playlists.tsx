import {Grid} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import * as React from 'react';
import {Link} from 'react-router-dom';
import * as User from '../api/User';

class Landing extends React.Component {
    public state: { playlists: Array<{ name: string, description: string, graph: string }> };

    constructor(props: any) {
        super(props);

        this.state = {
            playlists: []
        };
    }

    public render() {
        return (
            <Grid container={true} justify={'center'}>
                <Grid item={true} md={6} sm={8} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary">
                                Your playlists
                            </Typography>
                            <List style={{maxWidth: '500px'}}>
                                {
                                    this.state.playlists.map((playlist, index) => {
                                        return (
                                            <div key={index}>
                                                <ListItem>
                                                    <ListItemText>
                                                        {playlist.name}
                                                    </ListItemText>
                                                    <Link to={`/editor/${playlist.name}`}
                                                          style={{textDecoration: 'none'}}>
                                                        <ListItemSecondaryAction>
                                                            <IconButton>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </Link>
                                                </ListItem>
                                                <Divider inset={true}/>
                                            </div>
                                        )
                                    })
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }

    public async componentDidMount() {
        if (!(window as any).keycloak.authenticated) {
            await (window as any).keycloak.login();
        }
        const playlists: Array<{ name: string, description: string, graph: string }> = await User.playlists();
        this.setState({
            playlists
        });
    }
}

export default Landing;
