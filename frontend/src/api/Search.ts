import axios from "axios";

export async function searchPlaylist(name: string) {
    if (!name) {
        return [];
    }
    const untypedPlaylists = (await axios.get(`${process.env.REACT_APP_API_BASE}/search/playlist?q=${ name }`)).data;
    return untypedPlaylists.map((playlist: any) => {
        return {
            id: playlist.id,
            image: {
                height: playlist.image.height,
                url: playlist.image.url,
                width: playlist.image.width,
            },
            name: playlist.name,
            userId: playlist.userId,
        };
    });
}

export async function searchAlbum(name: string) {
    if (!name) {
        return [];
    }

    const untypedAlbums = (await axios.get(`${process.env.REACT_APP_API_BASE}/search/album?q=${ name }`)).data;
    return untypedAlbums.map((album: any) => {
        const artists: Array<{id: string, name: string}> = [];
        for (const artist of album.artists) {
            artists.push(artist);
        }
        return {
            artists,
            id: album.id,
            image: {
                height: album.image.height,
                url: album.image.url,
                width: album.image.width,
            },
            name: album.name,
        };
    });
}
