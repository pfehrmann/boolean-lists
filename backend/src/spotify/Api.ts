import * as express from "express";
import * as logger from "winston";
import * as SerializationConverter from "../convertSrdToBooleanLists/SerializationConverter";
import {fromJSON} from "../nodes/JsonParser";
import search from "../search/Search";
import Users from "../users/Users";
import {shuffleArray} from "../util";
import * as SpotifyAuthorization from "./Authorization";
import {Playlist} from "./Playlist";
import {InitializedSpotifyApi} from "./SpotifyApi";

export function router(keycloak: any): express.Router {
    const myRouter = express.Router();

    myRouter.use("/auth/spotify", SpotifyAuthorization.getRouter(keycloak));
    myRouter.use(keycloak.middleware());
    myRouter.use(express.json());
    myRouter.use("/search", keycloak.protect(), SpotifyAuthorization.authorized(), search);
    myRouter.use("/user", keycloak.protect(), Users);

    myRouter.post("/saveToSpotify", keycloak.protect(), SpotifyAuthorization.authorized(), async (req, res: any) => {
        try {
            const api: InitializedSpotifyApi = new InitializedSpotifyApi((req as any).api);
            const serialized = SerializationConverter.convertSrdToBooleanList(req.body.graph);
            logger.info("Using parsed node", serialized);
            const node = await fromJSON(api, serialized);

            let tracksToAdd = await node.getTracks();
            logger.info(`Adding ${tracksToAdd.length} tracks.`);

            const me = await api.me();

            let playlist: Playlist;
            if (req.body.playlistUri) {
                playlist = await Playlist.fromSpotifyUri(api, await me.id(), req.body.playlistUri);
            } else if (req.body.playlistName) {
                playlist = await me.createPlaylist(req.body.playlistName);
            } else {
                throw new Error("Enter a name of a playlist");
            }

            if (process.env.SHUFFLE) {
                logger.info(`Shuffling the playlist`);
                tracksToAdd = shuffleArray(tracksToAdd);
            }

            await playlist.clear();
            await playlist.addTracks(tracksToAdd);

            res.json(JSON.stringify({message: "Successfully added songs.", playlistUri: playlist.id()}));
        } catch (error) {
            logger.error(error.stack);
            res.sendStatus(500);
        }
    });

    return myRouter;
}
