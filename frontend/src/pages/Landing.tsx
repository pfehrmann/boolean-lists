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

export const Landing = () => {
  return (
    <div>
      <Parallax bgImage={concert} strength={500}>
        <div style={{ minHeight: 400 }}>
          <Grid container style={{ marginTop: "50px" }} justifyContent="center">
            <Grid item xs={11} md={8}>
              <Typography variant="h1" color="textSecondary">
                BooleanLists
              </Typography>
              <Typography variant="h2" color="textSecondary">
                Supercharge your Spotify playlists with ease!
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Parallax>
      <Parallax bgImage={turntables} strength={500} style={{ padding: 24 }}>
        <Grid container={true} justifyContent="center" spacing={2}>
          <FeatureCard title="Easy to use">
            We have created a super simple to use graph and node based editor to
            make editing a breeze
          </FeatureCard>
          <FeatureCard title="Store your lists">
            Yeah, we know, it's a pretty basic feature. But whatever. You can do
            it :D
          </FeatureCard>
          <FeatureCard title="Free">
            Yep, you have heard right: This service is completely free, so no
            worries about any costs.
          </FeatureCard>
          <FeatureCard title="Beta">
            This project is absolutely not done by now, so your data might be
            lost, playlists may not synchronize correctly, and so on. Be aware
            of this.
          </FeatureCard>
          <FeatureCard title="Questions?">
            In case you have any questions, feel free to write an email to{" "}
            <a href={"mailto:philipp.fehrmann@gmx.de"}>
              philipp.fehrmann@gmx.de
            </a>
          </FeatureCard>
        </Grid>
      </Parallax>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  children: string | React.ReactNode;
}
const FeatureCard = ({ title, children }: FeatureCardProps) => {
  return (
    <Grid item={true} xs={8} lg={4}>
      <Card>
        <CardContent>
          <Typography variant="h3" color="textSecondary">
            {title}
          </Typography>
          <br />
          <Typography variant="h4" color="textSecondary">
            {children}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
