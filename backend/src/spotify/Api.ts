import * as express from "express";
import * as logger from "winston";
import * as SerializationConverter from "../convertSrdToBooleanLists/SerializationConverter";
import apiExample from "../example/ApiExample";
import {fromJSON} from "../nodes/JsonParser";
import search from "../search/Search";
import Users from "../users/Users";
import {shuffleArray} from "../util";
import * as SpotifyAuthorization from "./Authorization";
import {InitializedSpotifyApi} from "./SpotifyApi";

export function router(keycloak: any): express.Router {
    const myRouter = express.Router();

    myRouter.use("/auth/spotify", SpotifyAuthorization.getRouter(keycloak));
    myRouter.use(keycloak.middleware());
    myRouter.use(express.json());
    myRouter.use("/search", keycloak.protect(), SpotifyAuthorization.authorized(), search);
    myRouter.use("/example", keycloak.protect(), SpotifyAuthorization.authorized(), apiExample);
    myRouter.use("/user", keycloak.protect(), Users);

    myRouter.post("/saveToSpotify", keycloak.protect(), SpotifyAuthorization.authorized(), async (req, res: any) => {
        try {
            const api: InitializedSpotifyApi = new InitializedSpotifyApi((req as any).api);
            const serialized = SerializationConverter.convertSrdToBooleanList(req.body);
            logger.info("Using parsed node", serialized);
            const node = await fromJSON(api, serialized);

            let tracksToAdd = await node.getTracks();
            logger.info(`Adding ${tracksToAdd.length} tracks.`);

            const me = await api.me();

            if (!await me.playlist("Test Playlist")) {
                await me.createPlaylist("Test Playlist");
            }
            const playlist = await me.playlist("Test Playlist");

            if (process.env.SHUFFLE) {
                logger.info(`Shuffling the playlist`);
                tracksToAdd = shuffleArray(tracksToAdd);
            }

            playlist.addTracks(tracksToAdd);

            res.json(JSON.stringify({message: "Successfully added songs."}));
        } catch (error) {
            logger.error(error.stack);
            res.sendStatus(500);
        }
    });

    return myRouter;
}