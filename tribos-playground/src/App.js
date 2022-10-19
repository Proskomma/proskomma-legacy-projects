import * as React from "react";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";

import { QueryRepl } from "components/QueryRepl";
import { withTheme } from "components/Theme";

function App() {
  return (
    <React.Fragment>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h5" noWrap>
            Tribos Playground
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container>
          <QueryRepl />
        </Container>
      </main>
    </React.Fragment>
  );
}

export default withTheme(App);
