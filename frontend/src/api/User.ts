import axios from "axios";

export async function addPlaylist(playlistItem: { description: string; graph: string; name: string }) {
    try {
        await axios.post(`${process.env.REACT_APP_API_BASE}/user/playlists`, JSON.stringify(playlistItem));
    } catch (err) {
        alert("Unexpected error");
    }
}

export async function playlists() {
    const playlistItems = (await axios.get(`${process.env.REACT_APP_API_BASE}/user/playlists`)).data;
    return playlistItems.map((playlistItem: any) => {
        return {
            description: playlistItem.description,
            graph: playlistItem.graph,
            name: playlistItem.name,
            uri: playlistItem.uri,
        };
    });
}

export async function playlist(id: string) {
    const rawPlaylist = (await axios.get(`${process.env.REACT_APP_API_BASE}/user/playlist/${id}`)).data;
    return {
        description: rawPlaylist.description,
        graph: rawPlaylist.graph,
        name: rawPlaylist.name,
        uri: rawPlaylist.uri,
    };
}

export async function deletePlaylist(id: string) {
    return axios.delete(`${process.env.REACT_APP_API_BASE}/user/playlist/${id}`);
}
