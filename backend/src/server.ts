let env = require('dotenv').config();
let SpotifyWebApi = require('spotify-web-api-node');
let opn = require('opn');
let express = require('express');
import { Request, Response, NextFunction } from 'express';
import * as SpotifyApi from './SpotifyApi';
import { getNelementsFromArray, shuffleArray } from './util';
import * as Nodes from './Nodes';

let app = express();
const playlistId = 1;

// Song counts must the be relative or absolute path to a json file
let songCounts = require(process.env.SONG_COUNTS)

SpotifyApi.initialize().then(async (api: SpotifyApi.InitializedSpotifyApi) => {
    try {
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

        let tracksToAdd: SpotifyApi.Track[] = await getTracksToAdd(me, songCounts);
        console.log(`Adding ${tracksToAdd.length} tracks.`);

        if(!await me.playlist('Test Playlist')) {
          await me.createPlaylist("Test Playlist");
        }
        let playlist = await me.playlist("Test Playlist");

        if(process.env.SHUFFLE) {
          console.log(`Shuffling the playlist`);
          shuffleArray(tracksToAdd);
        }

        playlist.addTracks(tracksToAdd);
    } catch (err) {
        console.log(err);
    }
});

async function getTracksToAdd(me, songCounts): Promise<SpotifyApi.Track[]> {
    let tracksToAdd: SpotifyApi.Track[] = [];

    let playlists: {playlist: Nodes.PlaylistNode, songCount: number}[] = [];

    for (let key of Object.keys(songCounts)) {
        console.log(`Getting key '${key}'...`);
        let playlist = await Nodes.IntermediatePlaylist.from(await me.playlist(key));
        playlists.push({playlist, songCount: songCounts[key]});
    }

    let addNode = new Nodes.AddNode(playlists, true);

    return addNode.getTracks();
}

async function getNrandomTracksFromPlaylist(playlist: SpotifyApi.Playlist, n: number): Promise<SpotifyApi.Track[]> {
    let tracks = await playlist.tracks();
    return getNelementsFromArray(n, tracks, true);
}

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
