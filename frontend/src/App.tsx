import * as React from 'react';
import './App.css';
import Editor from "./Editor";

class App extends React.Component {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="App">
                <Editor/>
            </div>
        );
    }
}

export default App;
