import React from "react";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";

import {CssBaseline} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Theme = (props) => {
  const { children } = props;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export const withTheme = (Component) => {
  return (props) => {
    return (
      <Theme>
        <CssBaseline />
        <Component {...props} />
      </Theme>
    );
  };
};
