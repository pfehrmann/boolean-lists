export async function searchPlaylist(name: string) {
    const untypedPlaylists = await (await fetch(`http://localhost:3000/search/playlist?q=${ name }`)).json();
    return untypedPlaylists.map((playlist: any) => {
        return {
            id: playlist.id,
            image: {
                height: playlist.image.height,
                url: playlist.image.url,
                width: playlist.image.width
            },
            name: playlist.name,
            userId: playlist.userId
        }
    });
}