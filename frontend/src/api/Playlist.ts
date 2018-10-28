import axios from "axios";

export async function getPlaylist(uri: string): Promise<any> {
    try {
        return await axios.get(`${process.env.REACT_APP_API_BASE}/playlists`, {params: {uri}});
    } catch (err) {
        alert("Unexpected error");
    }
}
