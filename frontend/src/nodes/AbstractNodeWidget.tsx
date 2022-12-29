import * as _ from "lodash";
import * as React from "react";
import * as SRD from "storm-react-diagrams";
import { AbstractNodeModel } from "./AbstractNodeModel";

export interface IAbstractNodeProps<
  T extends AbstractNodeModel = AbstractNodeModel
> extends SRD.BaseWidgetProps {
  node: T;
  diagramEngine: SRD.DiagramEngine;
  configOpen: boolean;
}

export abstract class AbstractNodeWidget<
  T extends IAbstractNodeProps = IAbstractNodeProps,
  S extends SRD.DefaultNodeState = SRD.DefaultNodeState
> extends SRD.BaseWidget<T, S> {
  protected constructor(name: string, props: T) {
    super(name, props);
  }

  public abstract onDoubleClick(): void;

  public generatePort(port: any) {
    return <SRD.DefaultPortLabel model={port} key={port.id} />;
  }

  public render() {
    return (
      <div onDoubleClick={this.onDoubleClick}>
        <div {...this.getProps()} style={{ background: this.props.node.color }}>
          <div className={this.bem("__title")}>
            <div className={this.bem("__name")}>{this.props.node.name}</div>
          </div>
          <div className={this.bem("__ports")}>
            <div className={this.bem("__in")}>
              {_.map(
                this.props.node.getInPorts(),
                this.generatePort.bind(this)
              )}
            </div>
            <div className={this.bem("__out")}>
              {_.map(
                this.props.node.getOutPorts(),
                this.generatePort.bind(this)
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
