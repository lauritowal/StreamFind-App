import React, { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertdriveIcon from "@mui/icons-material/InsertDriveFile";
import QueryIcon from "@mui/icons-material/QueryStats";
import "../index.css";
import MenuIcon from "@mui/icons-material/Menu";

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
        >
          <InsertdriveIcon
            style={{
              fontSize: "6em",
              color: "green",
              cursor: "pointer",
              marginLeft: "-9px",
            }}
          />
        </div>
        <h3>MassSpec Files</h3>
      </div>
      <div className="demo_box">
        <div className="upper_div">
          <h2 className="boxText">Engines</h2>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, "MsDataNode")}
          draggable
        >
          <FolderIcon
            style={{ fontSize: "6em", color: "orange", cursor: "pointer" }}
          />
        </div>
        <h3>MassSpecData</h3>
      </div>
      <div className="demo_box">
        <div className="upper_div">
          <h2 className="boxText">Module Processing</h2>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, "FindFeaturesNode")}
          draggable
        >
          <QueryIcon style={{ fontSize: "6em", cursor: "pointer" }} />
        </div>
        <h3>find_features</h3>
        <div
          onDragStart={(event) => onDragStart(event, "GroupFeaturesNode")}
          draggable
        >
          <QueryIcon style={{ fontSize: "6em", cursor: "pointer" }} />
        </div>
        <h3>group_features</h3>
      </div>
    </div>
  );
};
