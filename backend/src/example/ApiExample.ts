import * as express from "express";
import * as logger from "winston";
import {AddNode} from "../nodes/AddNode";
import {fromJSON} from "../nodes/JsonParser";
import * as Nodes from "../nodes/Nodes";
import {SpotifyPlaylistNode} from "../nodes/SpotifyPlaylistNode";
import {SubtractNode} from "../nodes/SubtractNode";
import {TopTracksNode} from "../nodes/TopTracksNode";
import {Playlist} from "../spotify/Playlist";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import * as SpotifyApi from "../spotify/SpotifyApi";
import {Track} from "../spotify/Track";
import {shuffleArray} from "../util";

// Song counts must the be relative or absolute path to a json file
const importedSongCounts = require(process.env.SONG_COUNTS);
const playlistId = 1;
const router = express.Router();

async function testApi(api: InitializedSpotifyApi) {
    try {
        const me = await api.me();
        const playlists = await me.playlists();
        logger.info(`Looking at playlist "${await playlists[playlistId].name()}"`);

        let tracks = await playlists[playlistId].tracks();
        logger.info(`Got ${await tracks.length} track(s) in playlist "${await playlists[playlistId].name()}"`);

        let playlistName = "Your Top Songs 2017";
        tracks = await (await me.playlist(playlistName)).tracks();
        logger.info(`Got ${await tracks.length} track(s) in playlist "${playlistName}"`);

        playlistName = "Oft gehört";
        logger.info(`user has playlist "${playlistName}": ${!!await me.playlist(playlistName)}`);

        playlistName = "I don't have this playlist!";
        logger.info(`user has playlist "${playlistName}": ${!!await me.playlist(playlistName)}`);

        const testPlaylist = await Playlist.fromSpotifyUri(api, "12172332235", "5zYaR2xWWYDxeprcjpPjdz");
        logger.info(`Playlist from user with id 12172332235 has name "${await testPlaylist.name()}"`);

        let tracksToAdd: Track[] = await getTracksToAdd(api, me, importedSongCounts);
        logger.info(`Adding ${tracksToAdd.length} tracks.`);

        if (!await me.playlist("Test Playlist")) {
            await me.createPlaylist("Test Playlist");
        }
        const playlist = await me.playlist("Test Playlist");

        if (process.env.SHUFFLE) {
            logger.info(`Shuffling the playlist`);
            tracksToAdd = shuffleArray(tracksToAdd);
        }

        await playlist.addTracks(tracksToAdd);
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

async function getTracksToAdd(api: InitializedSpotifyApi, me, songCounts): Promise<Track[]> {
    const playlists: Array<{ playlist: Nodes.PlaylistNode, songCount: number }> = [];

    for (const key of Object.keys(songCounts)) {
        logger.info(`Getting key '${key}'...`);
        const playlist = await SpotifyPlaylistNode.from(await me.playlist(key));
        playlists.push({playlist, songCount: songCounts[key]});
    }

    const minuend = await SpotifyPlaylistNode.from(await me.playlist("Minuend"));
    const subtrahend = await SpotifyPlaylistNode.from(await me.playlist("Subtrahend"));
    const subtractNode = await new SubtractNode(minuend, subtrahend);

    playlists.push({playlist: subtractNode, songCount: 0});

    const topTrackShort = await TopTracksNode.createNew(api, SpotifyApi.TimeRanges.SHORT);
    playlists.push({playlist: topTrackShort, songCount: 0});

    const addNode = new AddNode(playlists, true);

    // Transform to json and the parse again
    const json = JSON.stringify(addNode.toJSON());
    const node = await fromJSON(api, JSON.parse(json));

    return node.getTracks();
}

router.get("/", async (req, res) => {
    const api = new InitializedSpotifyApi((req as any).api);
    await testApi(api);
    res.sendStatus(200);
});

export default router;
