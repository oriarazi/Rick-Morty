import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { PropsWithChildren } from "react";

const theme = createTheme();

const AppThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
