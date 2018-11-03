import * as express from "express";
import * as SpotifyAuthorization from "../spotify/Authorization";

import Playlists from "./Playlists";
import search from "./Search";
import Users from "./Users";

export default function router(keycloak: any): express.Router {
    const myRouter = express.Router();

    myRouter.use("/auth/spotify", SpotifyAuthorization.getRouter(keycloak));
    myRouter.use(keycloak.middleware());
    myRouter.use(express.json());
    myRouter.use("/search", keycloak.protect(), SpotifyAuthorization.authorized(), search);
    myRouter.use("/me", keycloak.protect(), Users);
    myRouter.use("/playlist", keycloak.protect(), SpotifyAuthorization.authorized(), Playlists);

    return myRouter;
}
