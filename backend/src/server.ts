import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as  express from "express";
import * as winston from "winston";
import * as logger from "winston";
import * as SerializationConverter from "./convertSrdToBooleanLists/SerializationConverter";
import {AddNode} from "./nodes/AddNode";
import * as Nodes from "./nodes/Nodes";
import {SpotifyPlaylistNode} from "./nodes/SpotifyPlaylistNode";
import {SubtractNode} from "./nodes/SubtractNode";
import {TopTracksNode} from "./nodes/TopTracksNode";
import {Search} from "./search/Search";
import {Playlist} from "./spotify/Playlist";
import * as Spotify from "./spotify/SpotifyApi";
import * as SpotifyApi from "./spotify/SpotifyApi";
import {InitializedSpotifyApi} from "./spotify/SpotifyApi";
import {Track} from "./spotify/Track";
import {shuffleArray} from "./util";

const env = require("dotenv").config();

winston.add(new winston.transports.Console());

const app = express();
app.use(cors());
app.use(bodyParser());

const playlistId = 1;

// Song counts must the be relative or absolute path to a json file
const importedSongCounts = require(process.env.SONG_COUNTS);

SpotifyApi.initialize().then(async (api: SpotifyApi.InitializedSpotifyApi) => {
    const search = new Search(api);
    app.use("/search", search.router);

    app.post("/saveToSpotify", async (req, res: any) => {
        const serialized = SerializationConverter.convertSrdToBooleanList(req.body);
        const node = await Nodes.PlaylistNode.fromJSON(api, serialized);

        let tracksToAdd = await node.getTracks();
        logger.info(`Adding ${tracksToAdd.length} tracks.`);

        const me = await api.me();

        if (!await me.playlist("Test Playlist")) {
            await me.createPlaylist("Test Playlist");
        }
        const playlist = await me.playlist("Test Playlist");

        if (process.env.SHUFFLE) {
            logger.info(`Shuffling the playlist`);
            tracksToAdd = shuffleArray(tracksToAdd);
        }

        playlist.addTracks(tracksToAdd);

        res.json(JSON.stringify({message: "Successfully added songs."}));
    });

    app.listen(3000, () => {
        logger.info("Listening on port 3000");
    });
});

function testApi() {
    SpotifyApi.initialize().then(async (api: SpotifyApi.InitializedSpotifyApi) => {
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

            playlist.addTracks(tracksToAdd);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    });
}

// testApi();

async function getTracksToAdd(api: InitializedSpotifyApi, me, songCounts): Promise<Track[]> {
    const tracksToAdd: Track[] = [];

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

    const topTrackShort = await TopTracksNode.createNew(api, Spotify.TimeRanges.SHORT);
    playlists.push({playlist: topTrackShort, songCount: 0});

    const addNode = new AddNode(playlists, true);

    // Transform to json and the parse again
    const json = JSON.stringify(addNode.toJSON());
    const node = await Nodes.PlaylistNode.fromJSON(api, JSON.parse(json));

    return node.getTracks();
}
