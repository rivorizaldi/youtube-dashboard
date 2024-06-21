import SearchIcon from "@mui/icons-material/Search";

import { Box, IconButton, InputBase, Skeleton, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataGridCustom from "../../components/DataGridCustom";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import SimpleSnackbar from "../../components/SnackBar";
import VideoGrid from "../../components/VideoGrid";
import { tokens } from "../../theme";

function transformVideoData(videos) {
  const views = {
    id: "views",
    color: tokens("dark").greenAccent[500],
    data: [],
  };

  const likes = {
    id: "likes",
    color: tokens("dark").blueAccent[300],
    data: [],
  };

  const comments = {
    id: "comments",
    color: tokens("dark").redAccent[200],
    data: [],
  };

  videos.forEach((video, index) => {
    const xValue = video.title; // x value as a string

    views.data.push({ x: xValue, y: parseInt(video.viewCount, 10) });
    likes.data.push({ x: xValue, y: parseInt(video.likeCount, 10) });
    comments.data.push({ x: xValue, y: parseInt(video.commentCount, 10) });
  });

  return [views, likes, comments];
}

function convertToDateOnly(dateTimeStr) {
  // Create a new Date object from the date-time string
  const date = new Date(dateTimeStr);

  // Extract the year, month, and day from the Date object
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  // Combine them into the desired format
  return `${year}-${month}-${day}`;
}

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1] ? match[1].slice(0, 11) : null;
};

const Contacts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [errorNotification, setErrorNotification] = useState(false);
  const [errorNetworkNotification, setErrorNetworkNotification] =
    useState(false);
  const [fileTypeErrorNotification, setFileTypeErrorNotification] =
    useState(false);
  const [successNotification, setSuccessNotification] = useState(false);
  const [videos, setVideos] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const handleFetch = async (videoUrl) => {
    setIsLoading(true);
    try {
      await getYouTubeVideoData(videoUrl);
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    }
  };

  const getYouTubeVideoData = async (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      setErrorNetworkNotification(true);
      setTimeout(() => setErrorNetworkNotification(false), 3000);
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.REACT_APP_KEY}`
      );
      const data = await response.json();
      setIsLoading(false);
      if (data.items.length === 0) {
        setErrorNetworkNotification(true);
        setTimeout(() => setErrorNetworkNotification(false), 3000);
        return;
      }

      const video = data.items[0];
      const newVideo = {
        id: videoId,
        title: video.snippet.title,
        publicationDate: convertToDateOnly(video.snippet.publishedAt),
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        likeCount: video.statistics.likeCount,
        viewCount: video.statistics.viewCount,
        commentCount: video.statistics.commentCount,
      };

      const existingVideo = videos.find(
        (video) => video.videoUrl === newVideo.videoUrl
      );

      if (existingVideo) {
        setErrorNotification(true);
        setTimeout(() => setErrorNotification(false), 3000);
        return;
      }

      const updatedVideos = [...videos, newVideo];
      localStorage.setItem("videos", JSON.stringify(updatedVideos));
      setVideos(updatedVideos);
      setSuccessNotification(true);
    } catch (error) {
      setErrorNetworkNotification(true);
      setTimeout(() => setErrorNetworkNotification(false), 3000);
      console.error(error);
    }
  };

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged");
    if (isLogged !== "true") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const videoItems = JSON.parse(localStorage.getItem("videos")) ?? [];
    if (videoItems.length > 0) {
      setVideos(videoItems);
    }
  }, []);

  return (
    <Box m="20px">
      <Header title="VIDEOS" subtitle="List of Video Insight Data" />
      <SimpleSnackbar
        isOpen={successNotification}
        message={
          <div>
            <strong>Success:</strong> Video data has been successfully added.
          </div>
        }
        setIsOpen={setSuccessNotification}
      />
      <SimpleSnackbar
        isOpen={errorNotification}
        message={
          <div>
            <strong>Error:</strong> This video data already exists.
          </div>
        }
        setIsOpen={setErrorNotification}
      />
      <SimpleSnackbar
        isOpen={errorNetworkNotification}
        message={
          <div>
            <strong>Error:</strong> Invalid YouTube Video URL.
          </div>
        }
        setIsOpen={setErrorNotification}
      />
      <SimpleSnackbar
        isOpen={fileTypeErrorNotification}
        message={
          <div>
            <strong>Error:</strong> Invalid File Type.
          </div>
        }
        setIsOpen={setFileTypeErrorNotification}
      />
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
        marginBottom={"8px"}
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          value={videoUrl}
          placeholder="Enter Youtube Video Url"
          onChange={(e) => setVideoUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFetch(videoUrl);
              setVideoUrl("");
            }
          }}
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <VideoGrid
        videos={videos}
        handleDelete={(url) => {
          const updatedVideos = videos.filter(
            (video) => video.videoUrl !== url
          );
          localStorage.setItem("videos", JSON.stringify(updatedVideos));
          setVideos(updatedVideos);
        }}
      />
      <Box height="30vh">
        {isLoading ? (
          <Skeleton height={"30vh"} />
        ) : (
          <LineChart
            data={videos.length < 1 ? videos : transformVideoData(videos)}
          />
        )}
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGridCustom
          data={videos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setFileTypeErrorNotification={setFileTypeErrorNotification}
          setErrorNetworkNotification={setErrorNetworkNotification}
          setErrorNotification={setErrorNotification}
          setVideos={setVideos}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
