import * as _ from "lodash";
import * as logger from "winston";
import * as convert from "./Nodes";
import {TooManyRootsError} from "./TooManyRootsError";
import {UnknownNodeTypeError} from "./UnknownNodeTypeError";

export function convertSrdToBooleanList(srdSerialized: any): any {
    const roots = findRoots(srdSerialized);

    if (roots.length === 0) {
        logger.warn("No root found");
        return {};
    }

    if (roots.length > 1) {
        throw new TooManyRootsError("There is more than one root. Only one root is allowed.");
    }

    return convertSrdNodeToBooleanList(roots[0], srdSerialized);
}

function findRoots(srdSerialized: any): any[] {
    // find all nodes that have no connection on an incoming port

    const roots = [];
    for (const node of srdSerialized.nodes) {

        // check if node has incoming ports at all
        const outPorts = getOutPorts(node);
        if (outPorts.length > 0) {

            // check if any of those ports has a link
            const connectedOutPorts = outPorts.filter((port: any) => {
                return port.links.length !== 0;
            });

            if (connectedOutPorts.length === 0) {
                roots.push(node);
            }
        } else {
            roots.push(node);
        }
    }

    return roots;
}

function getOutPorts(node: any): any[] {
    let ports = [];

    if (node.ports) {
        ports = node.ports.filter((port: any) => {
            return port.in === false;
        });
    }

    return ports;
}

export function convertSrdNodeToBooleanList(srdNode: any, serialized: any): any {
    switch (srdNode.type) {
        case "add-node": {
            return convert.convertAddNode(srdNode, serialized);
        }
        case "playlist-node": {
            return convert.convertPlaylistNode(srdNode, serialized);
        }
        case "limit-node": {
            return convert.convertLimitNode(srdNode, serialized);
        }
        case "randomize-node": {
            return convert.convertRandomizeNode(srdNode, serialized);
        }
        case "subtract-node": {
            return convert.convertSubtractNode(srdNode, serialized);
        }
        case "my-top-tracks-node": {
            return convert.convertMyTopTracksNode(srdNode, serialized);
        }
    }
    throw new UnknownNodeTypeError("Node type '" + srdNode.type + "' is unknown.");
}

export function getChildNodes(srdNode: any, serialized: any): any[] {
    const inPorts = getInPorts(srdNode);

    const connectedNodes = _.flatten(inPorts.map((port: any) => {
        return getChildNodesOfPort(port, serialized);
    }));

    return connectedNodes.filter((node: any) => node.id !== srdNode.id);
}

export function getChildNodesOfPort(inPort: any, serialized: any, node?: any): any[] {
    const links = inPort.links.map((linkId: any) => serialized.links.find((link: any) => link.id === linkId));

    const nodes = _.flatten(links.map((link: any) => {
        return [
            serialized.nodes.find((srdNode: any) => srdNode.id === link.target),
            serialized.nodes.find((srdNode: any) => srdNode.id === link.source),
        ];
    }));

    if (!node) {
        return nodes;
    }

    return nodes.filter((other: any) => {
        return other.id !== node.id;
    });
}

export function getInPorts(srdNode: any): any[] {
    let ports = [];

    if (srdNode.ports) {
        ports = srdNode.ports.filter((port: any) => {
            return port.in === true;
        });
    }

    return ports;
}
