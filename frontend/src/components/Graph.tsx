import * as React from 'react';
import * as SRD from 'storm-react-diagrams';
import 'storm-react-diagrams/dist/style.min.css';

interface IGraphState {
  position: string;
  size: string;
}

class Graph extends React.Component<{ engine: SRD.DiagramEngine }> {
  public state: IGraphState;

  public constructor(props: any) {
    super(props);

    const zoom =
      (this.props.engine.getDiagramModel().getZoomLevel() / 100) * 60;
    const offsetX = this.props.engine.getDiagramModel().getOffsetX();
    const offsetY = this.props.engine.getDiagramModel().getOffsetY();

    this.state = {
      position: `${offsetX}px ${offsetY}px`,
      size: `${zoom}px ${zoom}px`,
    };
  }

  public componentDidMount() {
    this.props.engine.getDiagramModel().addListener({
      offsetUpdated: (event1) => {
        this.setState({
          position: `${event1.offsetX}px ${event1.offsetY}px`,
        });
      },
      zoomUpdated: (event1) => {
        const zoom = (event1.zoom / 100) * 60;
        this.setState({
          size: `${zoom}px ${zoom}px`,
        });
      },
    });
  }

  public render() {
    return (
      <SRD.DiagramWidget
        diagramEngine={this.props.engine}
        allowLooseLinks={false}
        maxNumberPointsPerLink={0}
        className="graph"
        inverseZoom={true}
        extraProps={{
          style: {
            backgroundSize: this.state.size,
            backgroundPosition: this.state.position,
          },
        }}
      />
    );
  }
}

export default Graph;
