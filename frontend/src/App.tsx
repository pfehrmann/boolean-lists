import * as React from 'react';
import './App.css';
import Editor from "./pages/Editor";

import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Landing from "./pages/Landing";

interface IAppState {
    tab: any;
}
class App extends React.Component {
    public state: IAppState;

    constructor(props: any) {
        super(props);

        this.state = {
            tab: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <div className="App">
                <AppBar position="static">
                    <Tabs value={this.state.tab} onChange={this.handleChange}>
                        <Tab label="Home" value={0}/>
                        <Tab label="Editor" value={1}/>
                    </Tabs>
                </AppBar>
                {this.state.tab === 0 && <Landing/>}
                {this.state.tab === 1 && <Editor/>}
            </div>
        );
    }

    private handleChange(event: any, value: any) {
        this.setState({tab: value});
    }
}

export default App;
