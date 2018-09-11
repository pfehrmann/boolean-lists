import * as SerializationConverter from "./SerializationConverter";
import {TooManyChildrenError} from "./TooManyChildrenError";

export function convertAddNode(srdNode: any, serialized: any): any {
    const children = SerializationConverter.getChildNodes(srdNode, serialized);
    const playlists = children.map((child: any) => {
        return {
            playlist: SerializationConverter.convertSrdNodeToBooleanList(child, serialized),
            songCount: 0,
        };
    });

    return {
        playlists,
        randomSelection: true,
        type: "AddNode",
    };
}

export function convertSubtractNode(srdNode: any, serialized: any): any {
    const inPorts = SerializationConverter.getInPorts(srdNode);
    const inPort = inPorts.find((port: any) => {
        return port.label === "In";
    });

    const subtractPort = inPorts.find((port: any) => {
        return port.label === "Subtract";
    });

    const inPlaylists = SerializationConverter.getChildNodesOfPort(inPort, serialized, srdNode);
    if (inPlaylists.length > 1) {
        throw new TooManyChildrenError(`Found more than one child for port 'In' of node '${srdNode}'`);
    }

    const subtractPlaylists = SerializationConverter.getChildNodesOfPort(subtractPort, serialized, srdNode);
    if (subtractPlaylists.length > 1) {
        throw new TooManyChildrenError(`Found more than one child for port 'Subtract' of node '${srdNode}'`);
    }

    return {
        minuend: SerializationConverter.convertSrdNodeToBooleanList(inPlaylists[0], serialized),
        subtrahend: SerializationConverter.convertSrdNodeToBooleanList(subtractPlaylists[0], serialized),
        type: "SubtractNode",
    };
}

export function convertPlaylistNode(srdNode: any, serialized: any): any {
    return {
        id: srdNode.configuration.id,
        type: "SpotifyPlaylistNode",
        userId: srdNode.configuration.userId,
    };
}

export function convertLimitNode(srdNode: any, serialized: any): any {
    const children = SerializationConverter.getChildNodes(srdNode, serialized);
    if (children.length > 1) {
        throw new TooManyChildrenError(`Found more than one child while processing node '${srdNode}'.`);
    }

    return {
        inPlaylist: SerializationConverter.convertSrdNodeToBooleanList(children[0], serialized),
        limit: srdNode.configuration.limit,
        type: "LimitNode",
    };
}

export function convertRandomizeNode(srdNode: any, serialized: any): any {
    const children = SerializationConverter.getChildNodes(srdNode, serialized);
    if (children.length > 1) {
        throw new TooManyChildrenError(`Found more than one child while processing node '${srdNode}'.`);
    }

    return {
        inPlaylist: SerializationConverter.convertSrdNodeToBooleanList(children[0], serialized),
        type: "RandomizeNode",
    };
}

export function convertMyTopTracksNode(srdNode: any, serialized: any): any {
    return {
        timeRange: srdNode.configuration.timeRange,
        type: "TopTracksNode",
    };
}

export function convertAlbumNode(srdNode: any, serialized: any): any {
    return {
        id: srdNode.configuration.id,
        type: "AlbumNode",
    };
}
