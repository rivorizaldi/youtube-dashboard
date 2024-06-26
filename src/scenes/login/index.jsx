import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens, useMode } from "../../theme";

export const Login = () => {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  //   useEffect(() => {
  //     const isLogged = localStorage.getItem("isLogged");
  //     if (isLogged) {
  //       navigate("/");
  //     }
  //   }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            {error && <Alert severity="error">Password Atau Email Salah</Alert>}

            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(false);
                }}
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(false);
                }}
                variant="filled"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                onClick={() => {
                  const isAuthenticated =
                    email === "admin@gmail.com" && password === "admin123";

                  if (!isAuthenticated) {
                    setError(true);
                    return;
                  }

                  localStorage.setItem("isLogged", "true");
                  navigate("/");
                }}
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
