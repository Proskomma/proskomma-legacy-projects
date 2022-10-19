import React, { useEffect, useState } from "react";
import { Grid, Container, Typography, TextField, Button } from "@mui/material";
import gqlPrettier from "graphql-prettier";

import ResultsView from "components/ResultsView";
import { initializeProskomma } from "proskommaUtils";

const runQuery = async (pk, query, setResult) => {
  console.time("Query");
  try {
    const result = await pk.gqlQuery(query);
    console.timeEnd("Query");
    console.log("Query Result", result);
    setResult(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
};

export const QueryRepl = () => {
  const [pk, setPk] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [formattingError, setFormattingError] = useState(false);

  useEffect(() => {
    const initPk = async () => {
      if (pk === null) {
        const pk = await initializeProskomma("nestle-1904");
        setPk(pk);
      }
    };
    initPk();
  }, [pk]);

  return (
    <Container>
      <p>Is Proskomma loaded? {pk ? "Yes" : "No"}</p>
      <Grid container justify="center" spacing={2}>
        <Grid item lg={10} align="center">
          <Typography variant="h6">Query</Typography>
          <TextField
            multiline
            rows={20}
            fullWidth
            inputProps={{ style: { fontFamily: "monospace" } }}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        </Grid>
        <Grid item md={2} align="center">
          <Button
            variant="contained"
            sx={{ m: 2, marginTop: 4 }}
            onClick={() => {
              try {
                setQuery(gqlPrettier(query));
                setFormattingError(false);
              } catch (error) {
                console.error(
                  "Something went wrong when formatting the query: ",
                  query
                );
                setFormattingError(true);
              }
            }}
          >
            Format
          </Button>

          <Button
            variant="contained"
            sx={{ m: 2 }}
            onClick={() => {
              runQuery(pk, query, setResult);
            }}
          >
            Run
          </Button>
          {formattingError && (
            <Typography sx={{ color: "red" }}>
              Formatting the query caused a problem.
            </Typography>
          )}
        </Grid>

        <Grid item lg={10} align="center">
          <ResultsView result={result} />
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={2}></Grid>
    </Container>
  );
};

export default QueryRepl;
