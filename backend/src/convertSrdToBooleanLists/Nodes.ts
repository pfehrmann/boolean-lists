import * as SerializationConverter from './SerializationConverter';

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
