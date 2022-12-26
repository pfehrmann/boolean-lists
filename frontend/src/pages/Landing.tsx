import * as React from "react";
import "../App.css";
import concert from "./concert.jpg";
import turntables from "./turntables.jpg";

import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
// noinspection TsLint
import { Parallax } from "react-parallax";
import { withStyles } from "@mui/styles";

const styles = {
  base: {},
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  root: {
    flexGrow: 1,
  },
};

const _Landing = () => {
  console.log(concert);
  return (
    <div>
      <Parallax bgImage={concert} strength={500}>
        <div style={{ minHeight: 400 }}>
          <Grid
            container={true}
            style={{ marginTop: "50px" }}
            rowSpacing={"center"}
          >
            <Grid item={true} xs={11} md={8}>
              <Typography variant="h3">BooleanLists</Typography>
              <Typography variant="h4">
                Supercharge your Spotify playlists with ease!
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Parallax>
      <Parallax bgImage={turntables} strength={500} style={{ padding: 24 }}>
        <Grid container={true} rowSpacing={"center"} spacing={24}>
          <Grid item={true} xs={8} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Easy to use</Typography>
                <br />
                <Typography variant="body2">
                  We have created a super simple to use graph and node based
                  editor to make editing a breeze
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={8} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Store your lists</Typography>
                <br />
                <Typography variant="body2">
                  Yeah, we know, it's a pretty basic feature. But whatever. You
                  can do it :D
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={8} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Free</Typography>
                <br />
                <Typography variant="body2">
                  Yep, you have heard right: This service is completely free, so
                  no worries about any costs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={8} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Beta</Typography>
                <br />
                <Typography variant="body2">
                  This project is absolutely not done by now, so your data might
                  be lost, playlists may not synchronize correctly, and so on.
                  Be aware of this.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={8} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Questions?</Typography>
                <br />
                <Typography variant="body2">
                  In case you have any questions, feel free to write an email to{" "}
                  <a href={"mailto:philipp.fehrmann@gmx.de"}>
                    philipp.fehrmann@gmx.de
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Parallax>
    </div>
  );
};

export const Landing = withStyles(styles)(_Landing);
