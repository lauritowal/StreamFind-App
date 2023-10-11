import React, { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertdriveIcon from "@mui/icons-material/InsertDriveFile";
import QueryIcon from "@mui/icons-material/QueryStats";
import "../index.css";
import MenuIcon from "@mui/icons-material/Menu";
import { Grid } from "@mui/material";

export default () => {
  const onDragStart = (event, nodeTypes) => {
    event.dataTransfer.setData("application/reactflow", nodeTypes);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="sidebar">
      <div className="demo_box">
        <div className="upper_div">
          <h2 className="boxText">Input</h2>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, "MsAnalysisNode")}
          draggable
          className="icon-container"
        >
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <InsertdriveIcon
                style={{
                  fontSize: "6em",
                  color: "green",
                  cursor: "pointer",
                }}
              />
            </Grid>
            <h3>MassSpec Files</h3>
          </Grid>
        </div>
      </div>
      <div className="demo_box">
        <div className="upper_div">
          <h2 className="boxText">Engines</h2>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, "MsDataNode")}
          draggable
          className="icon-container"
        >
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <FolderIcon
                style={{
                  fontSize: "6em",
                  color: "orange",
                  cursor: "pointer",
                }}
              />
            </Grid>
            <h3>MassSpecData</h3>
          </Grid>
        </div>
      </div>
      <div className="demo_box">
        <div className="upper_div">
          <h2 className="boxText">Module Processing</h2>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, "FindFeaturesNode")}
          draggable
          className="icon-container"
        >
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <QueryIcon style={{ fontSize: "6em", cursor: "pointer" }} />
            </Grid>
            <h3>find_features</h3>
          </Grid>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, "GroupFeaturesNode")}
          draggable
          className="icon-container"
        >
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <QueryIcon
                style={{
                  fontSize: "6em",
                  cursor: "pointer",
                }}
              />
            </Grid>
            <Grid item>
              <h3>group_features</h3>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
