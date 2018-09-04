import * as _ from 'lodash';
import * as logger from "winston"
import {TooManyRootsError} from "./TooManyRootsError";
import {UnknownNodeTypeError} from "./UnknownNodeTypeError";
import * as convert from "./Nodes"

export function convertSrdToBooleanList(srdSerialized: any): any {
    const roots = findRoots(srdSerialized);

    if(roots.length === 0) {
        logger.warn("No root found");
        return {};
    }

    if(roots.length > 1) {
        throw new TooManyRootsError("There is more than one root. Only one root is allowed.");
    }

    return convertSrdNodeToBooleanList(roots[0], srdSerialized);
}

function findRoots(srdSerialized: any): any[] {
    // find all nodes that have no connection on an incoming port

    const roots = [];
    for(const node of srdSerialized.nodes) {

        // check if node has incoming ports at all
        const outPorts = getOutPorts(node);
        if(outPorts.length > 0) {

            // check if any of those ports has a link
            const connectedOutPorts = outPorts.filter((port: any) => {
                return port.links.length !== 0;
            });

            if(connectedOutPorts.length === 0) {
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

    if(node.ports) {
        ports = node.ports.filter((port: any) => {
            return port.in === false;
        })
    }

    return ports;
}

export function convertSrdNodeToBooleanList(srdNode: any, serialized: any): any {
    if(srdNode.type === "add-node") {
        return convert.convertAddNode(srdNode, serialized);
    }

    if(srdNode.type === "playlist-node") {
        return convert.convertPlaylistNode(srdNode, serialized);
    }

    throw new UnknownNodeTypeError("Node type '" + srdNode.type + "' is unknown.")
}

export function getChildNodes(srdNode: any, serialized: any): any[] {
    const inPorts = getInPorts(srdNode);

    let links = _.flatten(inPorts.map((port: any) => port.links));
    links = links.map((linkId: any) => serialized.links.find((link: any) => link.id === linkId));

    const connectedNodes = _.flatten(links.map((link: any) => {
        return [
            serialized.nodes.find((node: any) => node.id === link.target),
            serialized.nodes.find((node: any) => node.id === link.source)
        ]
    }));

    return connectedNodes.filter((node: any) => node.id !== srdNode.id);
}

function getInPorts(node: any): any[] {
    let ports = [];

    if(node.ports) {
        ports = node.ports.filter((port: any) => {
            return port.in === true;
        })
    }

    return ports;
}