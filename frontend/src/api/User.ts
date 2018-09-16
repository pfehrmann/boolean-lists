import {authorizedFetch} from "./RequestWrapper";

export async function addPlaylist(playlistItem: { description: string; graph: string; name: string }) {
    try {
        await authorizedFetch(`${process.env.REACT_APP_API_BASE}/user/playlists`, {
            body: JSON.stringify(playlistItem),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            method: "POST",
        });
    } catch(err) {
        alert("Unexpected error");
    }
}


export async function playlists() {
    const playlistItems = await (await authorizedFetch(`${process.env.REACT_APP_API_BASE}/user/playlists`)).json();
    return playlistItems.map((playlistItem: any) => {
        return {
            description: playlistItem.description,
            graph: playlistItem.graph,
            name: playlistItem.name,
        }
    });
}

export async function playlist(id: string) {
    const rawPlaylist = await (await authorizedFetch(`${process.env.REACT_APP_API_BASE}/user/playlist/${id}`)).json();
    return {
            description: rawPlaylist.description,
            graph: rawPlaylist.graph,
            name: rawPlaylist.name,
    }
}

export async function deletePlaylist(id: string) {
    return authorizedFetch(`${process.env.REACT_APP_API_BASE}/user/playlist/${id}`, {
        method: "DELETE"
    })
}