import { withStyles } from "@mui/styles";
import * as React from "react";
import { Redirect } from "src/components/Redirect";
import "../App.css";

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

class Landing extends React.Component<{ classes: any }> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return <Redirect to={"/playlists"} />;
  }

  public async componentWillMount() {
    sessionStorage.setItem("loggedIn", "true");
  }
}

export default withStyles(styles)(Landing);
