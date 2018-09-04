import * as SerializationConverter from './SerializationConverter';
import {TooManyChildrenError} from "./TooManyChildrenError";

export function convertAddNode(srdNode: any, serialized: any): any {
    const children = SerializationConverter.getChildNodes(srdNode, serialized);
    const playlists = children.map((child: any) => {
        return {
            playlist: SerializationConverter.convertSrdNodeToBooleanList(child, serialized),
            songCount: 0
        }
    });

    return {
        playlists,
        randomSelection: true,
        type: "AddNode"
    }
}

export function convertPlaylistNode(srdNode: any, serialized: any): any {
    return {
        id: srdNode.configuration.id,
        type: "SpotifyPlaylistNode",
        userId: srdNode.configuration.userId
    }
}

export function convertLimitNode(srdNode: any, serialized: any): any {
    const children = SerializationConverter.getChildNodes(srdNode, serialized);
    if(children.length > 1) {
        throw new TooManyChildrenError(`Found more than one child while processing node '${srdNode}'.`);
    }

    return {
        inPlaylist: SerializationConverter.convertSrdNodeToBooleanList(children[0], serialized),
        limit: srdNode.configuration.limit,
        type: "LimitNode"
    }
}

export function convertRandomizeNode(srdNode: any, serialized: any): any {
    const children = SerializationConverter.getChildNodes(srdNode, serialized);
    if(children.length > 1) {
        throw new TooManyChildrenError(`Found more than one child while processing node '${srdNode}'.`);
    }

    return {
        inPlaylist: SerializationConverter.convertSrdNodeToBooleanList(children[0], serialized),
        type: "RandomizeNode"
    }
}