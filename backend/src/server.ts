require("dotenv").config();

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as  express from "express";
import * as winston from "winston";
import * as logger from "winston";
import * as SerializationConverter from "./convertSrdToBooleanLists/SerializationConverter";
import apiExampleRouter from "./example/ApiExample";
import {fromJSON} from "./nodes/JsonParser";
import {Search} from "./search/Search";
import * as SpotifyApi from "./spotify/SpotifyApi";

import {shuffleArray} from "./util";

winston.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    ),
}));

const app = express();
app.use(cors());
app.use(bodyParser());

SpotifyApi.initialize().then(async (api: SpotifyApi.InitializedSpotifyApi) => {
    const search = new Search(api);
    app.use("/search", search.router);
    app.use("/example", apiExampleRouter);

    app.post("/saveToSpotify", async (req, res: any) => {
        const serialized = SerializationConverter.convertSrdToBooleanList(req.body);
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

    app.listen(3000, () => {
        logger.info("Listening on port 3000");
    });
});
