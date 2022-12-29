import * as Express from "express";
import * as logger from "winston";
import { IUser, IUserMethods } from "../model/database/User";
import { getApiFromUser } from "../model/spotify/Authorization";
import { Playlist } from "../model/spotify/Playlist";

const router: Express.Router = Express.Router();

router.get("/", async (req, res) => {
  try {
    logger.info("Get api from request...");
    const user: IUser & IUserMethods = (req as any).user;
    const api = await getApiFromUser(user);
    if (req.query.uri) {
      const rawPlaylist = await Playlist.fromSpotifyUri(
        api,
        await (await api.me()).id(),
        req.query.uri
      );
      res.send({
        id: rawPlaylist.id(),
        image: rawPlaylist.image(),
        name: rawPlaylist.name(),
        userId: rawPlaylist.userId(),
      });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    throw new Error(error);
  }
});

export default router;
