import React from "react";

import { Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import ReactJson from "react-json-view";

import transformObjectValue from "helpers/transformObjectValue.js";

export const ResultsView = (props) => {
  const { result } = props;
  const usableResult = result || '{}';
  const [tab, setTab] = React.useState("1");

  const formattedResult = transformObjectValue(
    JSON.parse(usableResult),
    "tribos",
    (value) => {
      return JSON.parse(value);
    }
  );

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <React.Fragment>
      <Typography variant="h6">Result</Typography>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
            >
              <Tab label="Raw" value="1" />
              <Tab label="Formatted" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TextField
              multiline
              rows={20}
              fullWidth
              inputProps={{ style: { fontFamily: "monospace" } }}
              value={JSON.stringify(formattedResult, null, 2)}
            />
          </TabPanel>
          <TabPanel value="2">
            <ReactJson
              src={formattedResult}
              theme="monokai"
              indentWidth={2}
              style={{ textAlign: "left" }}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </React.Fragment>
  );
};

export default ResultsView;
