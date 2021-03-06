import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {AddNode} from "./AddNode";
import {AlbumNode} from "./AlbumNode";
import {ArtistTopTracksNode} from "./ArtistTopTracksNode";
import {FilterAudioFeaturesNode} from "./FilterAudioFeaturesNode";
import {IntermediatePlaylist} from "./IntermediatePlaylist";
import {LibraryNode} from "./LibraryNode";
import {LimitNode} from "./LimitNode";
import {RandomizeNode} from "./RandomizeNode";
import {SpotifyPlaylistNode} from "./SpotifyPlaylistNode";
import {SubtractNode} from "./SubtractNode";
import {TopTracksNode} from "./TopTracksNode";

export function fromJSON(api: InitializedSpotifyApi, json: { type: string }): Promise<IntermediatePlaylist> {
    switch (json.type) {
        case SpotifyPlaylistNode.type: {
            return SpotifyPlaylistNode.fromJSON(api, json);
        }
        case AddNode.type: {
            return AddNode.fromJSON(api, json);
        }
        case SubtractNode.type: {
            return SubtractNode.fromJSON(api, json);
        }
        case TopTracksNode.type: {
            return TopTracksNode.fromJSON(api, json);
        }
        case LimitNode.type: {
            return LimitNode.fromJSON(api, json);
        }
        case RandomizeNode.type: {
            return RandomizeNode.fromJSON(api, json);
        }
        case AlbumNode.type: {
            return AlbumNode.fromJSON(api, json);
        }
        case LibraryNode.type: {
            return LibraryNode.fromJSON(api, json);
        }
        case FilterAudioFeaturesNode.type: {
            return FilterAudioFeaturesNode.fromJSON(api, json);
        }
        case ArtistTopTracksNode.type: {
            return ArtistTopTracksNode.fromJSON(api, json);
        }
    }
    throw new Error("Cannot deserialize json node.");
}
