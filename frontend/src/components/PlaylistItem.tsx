import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { Box, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { Playlist } from '../api';
import listIcon from './list_icon.svg';

interface IPlaylistProps {
  playlist: Playlist;
  handleDelete?: () => any;
  handleSave?: () => any;
  link?: string;
}

export const PlaylistItem = ({
  playlist,
  handleDelete,
  handleSave,
  link,
}: IPlaylistProps) => {
  const theme = useTheme();
  return (
    <Card sx={{ display: 'flex' }}>
      <CardMedia
        sx={{ height: 151, width: 151 }}
        image={playlist.image?.url ?? listIcon}
        title={playlist.name}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="h5" variant="h5">
            {playlist.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {playlist.description}
          </Typography>
        </CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(1),
          }}
        >
          {handleDelete && (
            <IconButton aria-label="Delete" onClick={handleDelete}>
              <DeleteIcon color={'error'} />
            </IconButton>
          )}
          {handleSave && (
            <IconButton aria-label="Save" onClick={handleSave}>
              <PlaylistAddCheckIcon />
            </IconButton>
          )}
          <Link
            to={link || `/editor/${btoa(playlist.name)}`}
            style={{ textDecoration: 'none' }}
          >
            <IconButton>
              <EditIcon color={'action'} />
            </IconButton>
          </Link>
        </Box>
      </Box>
    </Card>
  );
};
