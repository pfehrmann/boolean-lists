declare module 'spotify-uri' {
  export enum types {
    'track',
    'playlist',
    'artist',
    'album',
    'show',
  }
  export interface IParsedSpotifyUri {
    uri: string;
    type: types | string;
    id: string;
    user?: string;
  }

  export function parse(uri: string): IParsedSpotifyUri;
  export function formatURI(parsed: IParsedSpotifyUri): string;
  export function formatOpenURL(parsed: IParsedSpotifyUri): string;
  export function formatPlayURL(parsed: IParsedSpotifyUri): string;
  export function formatEmbedURL(parsed: IParsedSpotifyUri): string;
}
