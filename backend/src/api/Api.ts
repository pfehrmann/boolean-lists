import * as express from "express";
import * as SpotifyAuthorization from "../model/spotify/Authorization";

import me from "./Me";
import playlists from "./Playlists";
import search from "./Search";

export default function router(): express.Router {
    const myRouter = express.Router();

    myRouter.use(express.json());
    myRouter.use("/me", SpotifyAuthorization.ensureAuthenticated, me);
    myRouter.use("/search", SpotifyAuthorization.ensureAuthenticated, search);
    myRouter.use("/playlist", SpotifyAuthorization.ensureAuthenticated, playlists);

    return myRouter;
}
