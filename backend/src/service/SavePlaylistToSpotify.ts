import * as logger from "winston";

import {Playlist as PlaylistEntity} from "../model/database/Playlist";
import {UserModel} from "../model/database/User";

import {fromJSON} from "../model/nodes/JsonParser";
import {getApiFromUser} from "../model/spotify/Authorization";
import {Playlist as SpotifyPlaylist} from "../model/spotify/Playlist";
import {InitializedSpotifyApi} from "../model/spotify/SpotifyApi";

import {convert} from "./serilizationConverter";

export default async function savePlaylistToSpotify(userId: string, playlistName: string) {
    const userResult = await UserModel.findOrCreate({id: userId});
    if (userResult.created) {
        throw new Error("User was not in the database");
    }

    const user = userResult.doc;
    const api: InitializedSpotifyApi = new InitializedSpotifyApi(await getApiFromUser(user));
    const playlistEntity = user.findPlaylist(playlistName);
    const serialized = convert(playlistEntity.graph);

    logger.info("Using parsed node", serialized);
    const node = await fromJSON(api, serialized);

    const tracksToAdd = await node.getTracks();
    logger.info(`Adding ${tracksToAdd.length} tracks.`);

    const playlist = await getOrCreateSpotifyPlaylist(playlistEntity, api);
    await playlist.clear();
    await playlist.addTracks(tracksToAdd);

    playlistEntity.uri = playlist.id();
    await user.save();

    return {
        message: "success",
        playlistUri: playlist.id(),
    };
}

async function getOrCreateSpotifyPlaylist(playlistEntity: PlaylistEntity, api: InitializedSpotifyApi) {
    const me = await api.me();
    let playlist: SpotifyPlaylist;
    if (playlistEntity.uri) {
        playlist = await SpotifyPlaylist.fromSpotifyUri(api, await me.id(), playlistEntity.uri);

        // check if the playlist was renamed. In this case create a new playlist
        if (playlist.name() !== playlistEntity.name) {
            logger.info("Name of Spotify playlist '" + playlist.name() + "' is different from playlistEntity name" +
                "'" + playlistEntity.name + "'");
            playlist = await me.createPlaylist(playlistEntity.name);
        }
    } else if (playlistEntity.name) {
        playlist = await me.createPlaylist(playlistEntity.name);
    } else {
        throw new Error("Enter a name of a playlist");
    }

    return playlist;
}
