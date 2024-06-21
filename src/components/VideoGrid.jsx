import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

const getYouTubeVideoId = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9-_]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
};

const VideoGrid = ({ videos, handleDelete }) => {
  return (
    <Grid container spacing={4}>
      {videos.map((video) => (
        <Grid item key={video.videoUrl} xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <CardMedia
              component="img"
              alt={video.title}
              height="140"
              image={`https://img.youtube.com/vi/${getYouTubeVideoId(
                video.videoUrl
              )}/0.jpg`}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Tooltip title={video.title}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {video.title}
                </Typography>
              </Tooltip>
              <Typography variant="body2" color="textSecondary">
                Like Count: {video.likeCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                View Count: {video.viewCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Comment Count: {video.commentCount}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => handleDelete(video.videoUrl)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoGrid;
