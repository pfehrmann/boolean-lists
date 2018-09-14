require("dotenv").config();

import * as cors from "cors";
import * as  express from "express";
import * as session from "express-session";
import * as Keycloak from "keycloak-connect";
import * as logger from "winston";
import * as winston from "winston";
import * as SerializationConverter from "./convertSrdToBooleanLists/SerializationConverter";
import apiExample from "./example/ApiExample";
import {fromJSON} from "./nodes/JsonParser";
import search from "./search/Search";
import * as SpotifyAuthorization from "./spotify/Authorization";
import {InitializedSpotifyApi} from "./spotify/SpotifyApi";
import Users from "./users/Users";

import {shuffleArray} from "./util";
const kcConfig = require("../keycloak.json");

winston.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    ),
}));

const sessionStore = new session.MemoryStore();
const keycloak = new Keycloak({store: sessionStore}, kcConfig);

const app = express();

app.use((err, req, res, next) => {
    logger.error(err);
    next(err);
});
app.use(cors());
app.use((req: express.Request, res: any, next: express.NextFunction) => {
    if (req.query.authorization) {
        req.headers.authorization = req.query.authorization;
    }
    next();
});
app.use("/auth/spotify", SpotifyAuthorization.getRouter(keycloak));
app.use(keycloak.middleware());
app.use(express.json());
app.use("/search", keycloak.protect(), SpotifyAuthorization.authorized(), search);
app.use("/example", keycloak.protect(), SpotifyAuthorization.authorized(), apiExample);
app.use("/user", keycloak.protect(), Users);

app.post("/saveToSpotify", keycloak.protect(), SpotifyAuthorization.authorized(), async (req, res: any) => {
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
});

app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}`);
});
