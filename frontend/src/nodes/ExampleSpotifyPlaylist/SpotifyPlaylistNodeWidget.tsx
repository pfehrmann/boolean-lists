import * as React from "react";
import {PortWidget} from "storm-react-diagrams";
import SpotifyPlaylistNodeModel from "./SpotifyPlaylistNodeModel";

export interface ISpotifyPlaylistNodeWidgetProps {
    node: SpotifyPlaylistNodeModel;
    size?: number;
}

export default class SpotifyPlaylistNodeWidget extends React.Component<ISpotifyPlaylistNodeWidgetProps, {}> {
    private static readonly defaultSize = 100;
    private readonly size: number;

    constructor(props: ISpotifyPlaylistNodeWidgetProps) {
        super(props);
        this.state = {};
        if (!this.props.size) {
            this.size = SpotifyPlaylistNodeWidget.defaultSize;
        } else {
            this.size = this.props.size;
        }
    }

    public render() {
        return (
            <div
                className={"diamond-node"}
                style={{
                    height: this.props.size,
                    position: "relative",
                    width: this.props.size
                }}
            >
                <svg
                    width={this.props.size}
                    height={this.props.size}
                    dangerouslySetInnerHTML={{
                        __html:
                            `
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="purple" stroke="#000000" stroke-width="3" stroke-miterlimit="10" points="10,` +
                            this.size / 2 +
                            ` ` +
                            this.size / 2 +
                            `,10 ` +
                            (this.size - 10) +
                            `,` +
                            this.size / 2 +
                            ` ` +
                            this.size / 2 +
                            `,` +
                            (this.size - 10) +
                            ` "/>
          </g>
        `
                    }}
                />
                <div
                    style={{
                        left: -8,
                        position: "absolute",
                        top: this.size / 2 - 8,
                        zIndex: 10
                    }}
                >
                    <PortWidget name="left" node={this.props.node}/>
                </div>
                <div
                    style={{
                        left: this.size / 2 - 8,
                        position: "absolute",
                        top: -8,
                        zIndex: 10
                    }}
                >
                    <PortWidget name="top" node={this.props.node}/>
                </div>
                <div
                    style={{
                        left: this.size - 8,
                        position: "absolute",
                        top: this.size / 2 - 8,
                        zIndex: 10
                    }}
                >
                    <PortWidget name="right" node={this.props.node}/>
                </div>
                <div
                    style={{
                        left: this.size / 2 - 8,
                        position: "absolute",
                        top: this.size - 8,
                        zIndex: 10
                    }}
                >
                    <PortWidget name="bottom" node={this.props.node}/>
                </div>
            </div>
        );
    }
}
