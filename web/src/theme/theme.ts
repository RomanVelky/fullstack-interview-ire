import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    special: true;
  }
}

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    sidebar: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#02D076",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#10BFFC",
      contrastText: "#ffffff",
    },
    background: {
      sidebar: "#1A2638",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      special: 1015,
    },
  },
});

export default theme;
