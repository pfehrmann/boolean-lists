import * as logger from "winston";
import {getNelementsFromArray} from "../../util";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {Track} from "../spotify/Track";
import {IntermediatePlaylist} from "./IntermediatePlaylist";
import {fromJSON} from "./JsonParser";
import {PlaylistNode} from "./Nodes";

export class AddNode extends IntermediatePlaylist {

    static get type(): string {
        return "AddNode";
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<AddNode> {
        const playlists: Array<{ playlist: PlaylistNode, songCount: number }> = [];

        for (const rawPlaylist of json.playlists) {
            playlists.push({
                playlist: await fromJSON(api, rawPlaylist.playlist),
                songCount: rawPlaylist.songCount,
            });
        }

        return new AddNode(playlists, json.randomSelection);
    }

    private playlists: Array<{ playlist: PlaylistNode, songCount: number }>;
    private randomSelection: boolean;

    constructor(playlists: Array<{ playlist: PlaylistNode, songCount: number }>, randomSelection: boolean) {
        super();

        this.playlists = [...playlists];
        this.randomSelection = randomSelection;

        this.initialize();
    }

    public toJSON() {
        const playlists: any[] = [];
        for (const playlist of this.playlists) {
            playlists.push({playlist: playlist.playlist.toJSON(), songCount: playlist.songCount});
        }

        return {
            playlists,
            randomSelection: this.randomSelection,
            type: AddNode.type,
        };
    }

    private initialize() {
        for (const playlistCount of this.playlists) {
            this.addTracks(
                this.getTracksFromPlaylist(playlistCount.playlist, playlistCount.songCount),
            );
        }
        logger.debug(`Initialized AddNode. Node has ${this.getTracks().length} tracks.`);
    }

    private getTracksFromPlaylist(playlist: PlaylistNode, songCount: number): Track[] {
        const tracks = playlist.getTracks();
        logger.debug(`Playlist ${playlist} has ${tracks.length} tracks. Getting ${songCount} tracks from playlist...`);
        return getNelementsFromArray(songCount, tracks, this.randomSelection);
    }
}
