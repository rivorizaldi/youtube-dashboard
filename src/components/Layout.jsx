import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { useSidebar } from "../context/useSidebar";
import Sidebar from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";
import { ColorModeContext, useMode } from "../theme";

const Layout = ({ children }) => {
  const [theme, colorMode] = useMode();
  const { isCollapsed } = useSidebar();

  const adjustWidth = isCollapsed ? "80px" : "270px";
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar />
          <main
            className="content"
            style={{
              marginLeft: adjustWidth,
              width: `calc(100% - ${adjustWidth})`,
            }}
          >
            <Topbar setIsSidebar={null} />
            {children}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Layout;
