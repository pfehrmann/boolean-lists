import * as logger from "winston";

import { IPlaylist as PlaylistEntity } from "../model/database/Playlist";
import { User as UserModel } from "../model/database/User";

import { fromJSON } from "../model/nodes/JsonParser";
import { getApiFromUser } from "../model/spotify/Authorization";
import { Playlist as SpotifyPlaylist } from "../model/spotify/Playlist";
import { InitializedSpotifyApi } from "../model/spotify/SpotifyApi";

import { convert } from "./serilizationConverter";

export default async function savePlaylistToSpotify(spotifyId: string, playlistName: string) {
    const user = await UserModel.findOne({ spotifyId });
    if (!user) {
        throw new Error("User was not in the database");
    }

    const api: InitializedSpotifyApi = await getApiFromUser(user);
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
            playlist = await me.createPlaylist(playlistEntity.name, playlistEntity.description);
        }

        // check description and maybe update that
        if (playlist.description() !== playlistEntity.description) {
            logger.info(`Description of playlist ${playlist.name()} was changed. Updating it.`);
            await playlist.updateDescription(playlistEntity.description);
        }
    } else if (playlistEntity.name) {
        playlist = await me.createPlaylist(playlistEntity.name, playlistEntity.description);
    } else {
        throw new Error("Enter a name of a playlist");
    }

    return playlist;
}
