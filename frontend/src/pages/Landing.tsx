import * as React from 'react';
import '../App.css';
import * as concert from './concert.jpg';
import * as turntables from './turntables.jpg';

import {Grid} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// noinspection TsLint
import {Parallax} from "react-parallax";

const styles = {
    base: {},
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    root: {
        flexGrow: 1,
    }
};

class Landing extends React.Component<{ classes: any }> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className={this.props.classes.base}>
                <Parallax bgImage={concert} strength={500}>
                    <div style={{height: 500}}>
                        <Grid container={true} style={{marginTop: "50px"}} justify={"center"}>
                            <Grid item={true} xs={11} md={8}>
                                <Typography variant="display4">BooleanLists</Typography>
                                <Typography variant="display3">Supercharge your Spotify playists with
                                    ease!</Typography>
                            </Grid>
                        </Grid>
                    </div>
                </Parallax>
                <Parallax bgImage={turntables} strength={500}>
                <Grid container={true} style={{marginTop: "20px", maxWidth: "95vw"}} justify={"center"} spacing={24}>
                    <Grid item={true} xs={8} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="display2">Easy to use</Typography><br/>
                                <Typography variant="display1">We have created a super simple to use graph and node
                                    based editor to make editing a breeze</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item={true} xs={8} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="display2">Store your lists</Typography><br/>
                                <Typography variant="display1">Yeah, we know, it's a pretty basic feature. But whatever.
                                    You can do it :D</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item={true} xs={8} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="display2">Free</Typography><br/>
                                <Typography variant="display1">Yep, you have heart right: This service is completly
                                    free, so no worries about any costs.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                </Parallax>
            </div>
        );
    }
}

export default withStyles(styles)(Landing);
