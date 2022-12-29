import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import * as api from "../api";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import PlaylistItem from "../components/PlaylistItem";
import { logger } from "src/utils/logger";

interface IPlaylist {
  name: string;
  description?: string;
  graph?: string;
  image?: { url: string };
}

export const Playlists = () => {
  const [, setPlaylists] = useState<IPlaylist[]>([]);
  const [open, setOpen] = useState(false);
  const [deletePlaylist, setDeletePlaylist] = useState("");
  const [playlistItems, setPlaylistItems] = useState<any[]>([]);
  const navigate = useNavigate();

  async function updatePlaylists() {
    try {
      const pageablePlaylists = await api
        .MeApiFp()
        .getMyPlaylists({ credentials: "include" })();

      // render all playlists, render images later.
      const playlistItemsTemp = pageablePlaylists.playlists.map(
        (playlist, index) => {
          return (
            <Grid item={true} md={6} sm={10} xs={12} key={index}>
              <div key={index}>
                <PlaylistItem
                  playlist={playlist}
                  handleDelete={() => {
                    setDeletePlaylist(playlist.name);
                    setOpen(true);
                  }}
                  handleSave={savePlaylist(playlist.name)}
                />
                <Divider />
              </div>
            </Grid>
          );
        }
      );

      setPlaylistItems(playlistItemsTemp);

      const playlists = await Promise.all(
        pageablePlaylists.playlists.map(async (playlist) => {
          if (playlist.uri) {
            try {
              const apiPlaylist = await api
                .PlaylistApiFp()
                .getPlaylistByUri(playlist.uri, { credentials: "include" })();
              if (apiPlaylist.image) {
                playlist.image = apiPlaylist.image;
              }
            } catch (error) {
              if (error.status === 401) {
                navigate("/login");
              }
            }
          }
          return playlist;
        })
      );

      const playlistItems = playlists.map((playlist, index) => {
        return (
          <Grid item md={6} sm={10} xs={12} key={index}>
            <div key={index}>
              <PlaylistItem
                playlist={playlist}
                handleDelete={() => {
                  setDeletePlaylist(playlist.name);
                  setOpen(true);
                }}
                handleSave={savePlaylist(playlist.name)}
              />
              <Divider />
            </div>
          </Grid>
        );
      });

      setPlaylistItems(playlistItems);
      setPlaylists(playlists);
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      }
    }
  }

  function savePlaylist(playlistName: string): () => any {
    return async () => {
      await api
        .MeApiFp()
        .savePlaylistToSpotify({ playlistName }, { credentials: "include" })();
      window.alert("Saved playlist");
    };
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleDelete() {
    try {
      await api.MeApiFp().deleteMyPlaylistById(deletePlaylist, {
        credentials: "include",
      })();
      updatePlaylists();
    } catch (error) {
      logger.error(error.stack);
      if (error.status === 401) {
        navigate("/login");
      }
    }
    setOpen(false);
  }

  useEffect(() => {
    updatePlaylists();
  }, []);

  return (
    <div style={{ padding: 8 }}>
      <Grid
        container
        justifyContent="center"
        style={{ marginTop: "2em" }}
        spacing={1}
        component="div"
      >
        <Grid item={true} xs={12} sm={10}>
          <Typography color="textSecondary" component="h2" variant="h2">
            Your playlists
          </Typography>
        </Grid>
        <Grid item={true} container={true} spacing={16} xs={10}>
          {playlistItems}
          <Grid item={true} md={6} sm={10} xs={12}>
            <div>
              <PlaylistItem
                playlist={{
                  name: "New Playlist",
                  id: "new-playlist",
                  userId: "",
                }}
              />
              <Divider />
            </div>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete playlist?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Delete the playlist "{deletePlaylist}". This action cannot be
              undone, there will be no way to recover your playlist.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus={true}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
};
