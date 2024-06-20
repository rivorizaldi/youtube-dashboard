import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputBase, Skeleton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { mockVideoData } from "../../data/mockData";
import { tokens } from "../../theme";

const Contacts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
      field: "views",
      headerName: "Views",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "likes",
      headerName: "Likes",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "dislikes",
      headerName: "Dislikes",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "comments",
      headerName: "Comments",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "duration", headerName: "Duration", flex: 1 },
    { field: "keywords", headerName: "Keywords", flex: 1 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Clean up the timeout when the component is unmounted or when useEffect is called again
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <Box m="20px">
      <Header title="VIDEOS" subtitle="List of Video Insight Data" />
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Enter Youtube Video Url"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsLoading(true);
            }
          }}
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box height="30vh">
        {isLoading ? <Skeleton height={"30vh"} /> : <LineChart />}
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
        {isLoading ? (
          <>
            <Skeleton height={"10vh"} />
            <Skeleton height={"2vh"} />
            <Skeleton height={"2vh"} />
            <Skeleton height={"2vh"} />
          </>
        ) : (
          <DataGrid
            rows={mockVideoData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Contacts;
