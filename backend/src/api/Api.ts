import * as express from "express";
import * as SpotifyAuthorization from "../model/spotify/Authorization";

import me from "./Me";
import playlists from "./Playlists";
import search from "./Search";

export default function router(keycloak: any): express.Router {
    const myRouter = express.Router();

    myRouter.use(keycloak.middleware());
    myRouter.use(express.json());
    myRouter.use("/me", keycloak.protect(), me);
    myRouter.use("/search", keycloak.protect(), SpotifyAuthorization.authorized(), search);
    myRouter.use("/playlist", keycloak.protect(), SpotifyAuthorization.authorized(), playlists);

    return myRouter;
}
