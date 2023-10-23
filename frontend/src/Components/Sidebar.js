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
      <div className="nodeCategory">
        <h2 className="nodeCategoryTitle">Input</h2>
        <div
          onDragStart={(event) => onDragStart(event, "MassSpecFiles")}
          draggable
          className="icon-container"
        >
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <InsertdriveIcon
                style={{
                  fontSize: "6em",
                  color: "grey",
                  cursor: "pointer",
                }}
              />
            </Grid>
            <h3>MassSpec Files</h3>
          </Grid>
        </div>
      </div>
      <div className="nodeCategory">
        <h2 className="nodeCategoryTitle">Engines</h2>
        <div
          onDragStart={(event) => onDragStart(event, "MassSpecData")}
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
      <div className="nodeCategory">
        <h2 className="nodeCategoryTitle">Module Processing</h2>
        <div
          onDragStart={(event) => onDragStart(event, "FindFeatures")}
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
          onDragStart={(event) => onDragStart(event, "GroupFeatures")}
          draggable
          className="icon-container"
        >
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <QueryIcon
                style={{
                  fontSize: "6em",
                  cursor: "pointer",
                  color: "#1976d2",
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
