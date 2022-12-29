import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "winston";
import { IUser, IUserMethods } from "../model/database/User";
import { Album } from "../model/spotify/Album";
import { Artist } from "../model/spotify/Artist";
import { getApiFromUser } from "../model/spotify/Authorization";
import { Playlist } from "../model/spotify/Playlist";

const router: express.Router = express.Router();

router.use(bodyParser.json());

router.get("/playlist", async (req, res) => {
  try {
    const user: IUser & IUserMethods = (req as any).user;
    const api = await getApiFromUser(user);
    const page = req.query.page ? req.query.page : 0;
    const elementsPerPage = 20;
    const internalPlaylists = await api.searchForPlaylists(req.query.q, {
      limit: elementsPerPage,
      offset: page * elementsPerPage,
    });
    logger.info(internalPlaylists);
    const playlists = internalPlaylists.map((playlist: Playlist) => {
      return {
        id: playlist.id(),
        image: playlist.image(),
        name: playlist.name(),
        userId: playlist.userId(),
      };
    });

    res.json({
      // TODO: get actual elements count
      elements: 0,
      elementsPerPage,
      page,
      playlists,
    });
  } catch (error) {
    if (error.trace) {
      logger.error(error.trace);
    } else {
      logger.error(error.stack);
      logger.error(new Error().stack);
    }
    res.sendStatus(500);
  }
});

router.get("/album", async (req, res) => {
  const user: IUser & IUserMethods = (req as any).user;
  const api = await getApiFromUser(user);
  const page = req.query.page ? req.query.page : 0;
  const elementsPerPage = 20;
  const internalAlbums = await api.searchForAlbums(req.query.q, {
    limit: elementsPerPage,
    offset: page * elementsPerPage,
  });
  const albums = internalAlbums.map((album: Album) => {
    const artists: Array<{ id: string; name: string }> = album
      .artists()
      .map((artist) => {
        return {
          id: artist.id(),
          name: artist.name(),
        };
      });
    return {
      artists,
      id: album.id(),
      image: album.image(),
      name: album.name(),
    };
  });

  res.json({
    albums,
    // TODO: get actual elements count
    elements: 0,
    elementsPerPage,
    page,
  });
});

router.get("/artist", async (req, res) => {
  const user: IUser & IUserMethods = (req as any).user;
  const api = await getApiFromUser(user);
  const page = req.query.page ? req.query.page : 0;
  const elementsPerPage = 20;
  const internalArtists = await api.searchForArtists(req.query.q, {
    limit: elementsPerPage,
    offset: page * elementsPerPage,
  });
  const artists = internalArtists.map((artist: Artist) => {
    return {
      id: artist.id(),
      image: artist.image(),
      name: artist.name(),
    };
  });

  res.json({
    artists,
    // TODO: get actual elements count
    elements: 0,
    elementsPerPage,
    page,
  });
});

export default router;
