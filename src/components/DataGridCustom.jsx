import { Button, Skeleton } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

import React, { useRef } from "react";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport
        printOptions={{ disableToolbarButton: true }}
        csvOptions={{
          allColumns: true,
          fileName: "youtube_video_data.csv",
        }}
      />
    </GridToolbarContainer>
  );
}

const columns = [
  { field: "id", headerName: "ID", flex: 0.5 },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    cellClassName: "name-column--cell",
  },
  {
    field: "publicationDate",
    headerName: "Publication Date",
    headerAlign: "left",
    align: "left",
  },
  {
    field: "viewCount",
    headerName: "Views",
    type: "number",
    headerAlign: "left",
    align: "left",
  },
  {
    field: "likeCount",
    headerName: "Likes",
    type: "number",
    headerAlign: "left",
    align: "left",
  },
  {
    field: "commentCount",
    headerName: "Comments",
    type: "number",
    headerAlign: "left",
    align: "left",
  },
  {
    field: "videoUrl",
    headerName: "Video URL",
    align: "left",
  },
];

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1] ? match[1].slice(0, 11) : null;
};

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

const DataGridCustom = ({
  isLoading,
  data,
  setFileTypeErrorNotification,
  setIsLoading,
  setErrorNetworkNotification,
  setErrorNotification,
  setVideos,
}) => {
  const fileInputRef = useRef(null);

  const handleFetch = async (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      setErrorNetworkNotification(true);
      setTimeout(() => setErrorNetworkNotification(false), 3000);
      return null; // Return null for invalid video ID
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.REACT_APP_KEY}`
      );
      const responseData = await response.json();

      if (responseData.items.length === 0) {
        setErrorNetworkNotification(true);
        setTimeout(() => setErrorNetworkNotification(false), 3000);
        return null; // Return null for no data items
      }

      const video = responseData.items[0];
      const newVideo = {
        id: videoId,
        title: video.snippet.title,
        publicationDate: convertToDateOnly(video.snippet.publishedAt),
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        likeCount: video.statistics.likeCount,
        viewCount: video.statistics.viewCount,
        commentCount: video.statistics.commentCount,
      };

      const existingVideo = data.find(
        (video) => video.videoUrl === newVideo.videoUrl
      );

      if (existingVideo) {
        setErrorNotification(true);
        setTimeout(() => setErrorNotification(false), 3000);
        return null; // Return null for existing video
      }

      return newVideo; // Return the new video object
    } catch (error) {
      setErrorNetworkNotification(true);
      setTimeout(() => setErrorNetworkNotification(false), 3000);
      console.error(error);
      return null; // Return null for fetch errors
    }
  };

  const handleUploadCsv = (e) => {
    setIsLoading(true);
    const csvFile = e.target.files[0];

    if (csvFile) {
      const validFileTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!validFileTypes.includes(csvFile.type)) {
        setFileTypeErrorNotification(true);
        setTimeout(() => setFileTypeErrorNotification(false), 3000);
        setIsLoading(false);
        return;
      }

      const reader = new FileReader();

      reader.onload = function (e) {
        if (e && e.target) {
          const csv = e.target.result.toString();
          const lines = csv.split(/\r\n|\n/);
          const headers = lines[0].split(",");
          const videoUrlIndex = headers.indexOf("Video URL");
          const urls = lines
            .slice(1)
            .map((line) => {
              const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
              return fields[videoUrlIndex];
            })
            .filter(
              (url) => url !== undefined && url !== null && url.trim() !== ""
            );

          Promise.all(
            urls.map(async (url) => {
              try {
                return await handleFetch(url);
              } catch (error) {
                console.error(error.message);
                return null; // Returning null for errors to avoid rejecting the Promise.all
              }
            })
          ).then((results) => {
            const successfulVideos = results.filter((video) => video !== null);
            const updatedVideos = [...data, ...successfulVideos];
            localStorage.setItem("videos", JSON.stringify(updatedVideos));
            setVideos(updatedVideos);
            setIsLoading(false);
          });
        }
      };
      reader.readAsText(csvFile);
    }
  };

  // Trigger the hidden file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return isLoading ? (
    <>
      <Skeleton height={"10vh"} />
      <Skeleton height={"2vh"} />
      <Skeleton height={"2vh"} />
      <Skeleton height={"2vh"} />
    </>
  ) : (
    <>
      <Button
        variant="contained"
        onClick={handleButtonClick}
        style={{ marginBottom: 20 }}
      >
        Upload CSV
      </Button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUploadCsv}
      />
      <DataGrid
        initialState={{
          columns: {
            columnVisibilityModel: {
              videoUrl: false,
            },
          },
        }}
        rows={data}
        columns={columns}
        components={{ Toolbar: () => <CustomToolbar /> }}
      />
    </>
  );
};

export default DataGridCustom;
