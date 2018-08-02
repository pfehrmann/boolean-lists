import * as React from 'react';
import * as SRD from "storm-react-diagrams";
import "storm-react-diagrams/dist/style.min.css";

class Graph extends React.Component<{ engine: SRD.DiagramEngine }> {
    public constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <SRD.DiagramWidget diagramEngine={this.props.engine} className="graph"/>
        );
    }
}

export default Graph;
