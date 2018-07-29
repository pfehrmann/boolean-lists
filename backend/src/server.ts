let env = require('dotenv').config();
let SpotifyWebApi = require('spotify-web-api-node');
let opn = require('opn');
let express = require('express');
import { Request, Response, NextFunction } from 'express';
import * as SpotifyApi from './SpotifyApi';
import { getNelementsFromArray, shuffleArray } from './util';
import * as Nodes from './Nodes';
import * as Spotify from './SpotifyApi';

let app = express();
const playlistId = 1;

// Song counts must the be relative or absolute path to a json file
let songCounts = require(process.env.SONG_COUNTS)

SpotifyApi.initialize().then(async (api: SpotifyApi.InitializedSpotifyApi) => {
    try {
        Nodes.initializeNodes(api);

        let me = await api.me();
        let playlists = await me.playlists();
        console.log(`Looking at playlist "${await playlists[playlistId].name()}"`);

        let tracks = await playlists[playlistId].tracks();
        console.log(`Got ${await tracks.length} track(s) in playlist "${await playlists[playlistId].name()}"`);

        let playlistName = 'Your Top Songs 2017'
        tracks = await (await me.playlist(playlistName)).tracks();
        console.log(`Got ${await tracks.length} track(s) in playlist "${playlistName}"`);

        playlistName = 'Oft gehört'
        console.log(`user has playlist "${playlistName}": ${!!await me.playlist(playlistName)}`);

        playlistName = 'I don\'t have this playlist!'
        console.log(`user has playlist "${playlistName}": ${!!await me.playlist(playlistName)}`);

        let testPlaylist = await SpotifyApi.Playlist.fromSpotifyUri("12172332235", "5zYaR2xWWYDxeprcjpPjdz");
        console.log(`Playlist from user with id 12172332235 has name "${await testPlaylist.name()}"`);

        let tracksToAdd: SpotifyApi.Track[] = await getTracksToAdd(me, songCounts);
        console.log(`Adding ${tracksToAdd.length} tracks.`);

        if(!await me.playlist('Test Playlist')) {
          await me.createPlaylist("Test Playlist");
        }
        let playlist = await me.playlist("Test Playlist");

        if(process.env.SHUFFLE) {
          console.log(`Shuffling the playlist`);
          tracksToAdd = shuffleArray(tracksToAdd);
        }

        playlist.addTracks(tracksToAdd);
    } catch (err) {
        console.log(err);
        throw err;
    }
});

async function getTracksToAdd(me, songCounts): Promise<SpotifyApi.Track[]> {
    let tracksToAdd: SpotifyApi.Track[] = [];

    let playlists: {playlist: Nodes.PlaylistNode, songCount: number}[] = [];

    for (let key of Object.keys(songCounts)) {
        console.log(`Getting key '${key}'...`);
        let playlist = await Nodes.SpotifyPlaylistNode.from(await me.playlist(key));
        playlists.push({playlist, songCount: songCounts[key]});
    }

    let minuend = await Nodes.SpotifyPlaylistNode.from(await me.playlist("Minuend"));
    let subtrahend = await Nodes.SpotifyPlaylistNode.from(await me.playlist("Subtrahend"));
    let subtractNode = await new Nodes.SubtractNode(minuend, subtrahend);

    playlists.push({playlist: subtractNode, songCount: 0});

    let topTrackShort = await Nodes.TopTracksNode.createNew(Spotify.TimeRanges.SHORT);
    playlists.push({playlist: topTrackShort, songCount: 0})

    let addNode = new Nodes.AddNode(playlists, true);

    // Transform to json and the parse again
    let json = JSON.stringify(addNode.toJSON());
    let node = await Nodes.PlaylistNode.fromJSON(JSON.parse(json));

    return node.getTracks();
}

async function getNrandomTracksFromPlaylist(playlist: SpotifyApi.Playlist, n: number): Promise<SpotifyApi.Track[]> {
    let tracks = await playlist.tracks();
    return getNelementsFromArray(n, tracks, true);
}

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
