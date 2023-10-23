import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, { Handle, Position, useNodesState } from "reactflow";
import InsertDriveIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SelectMzml from "../SelectMzml";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const handleStyle = { left: 10 };

const MassSpecFiles = ({
  id,
  data: { label, edges, inputFiles, setNodes },
  isConnectable,
}) => {
  const [selectedFiles, setSelectedFiles] = useState("");
  const [stepName, setStepName] = useState("");
  const [fileNames, setfileNames] = useState([]);

  const handleOpen = () => {
    setStepName("openModal");
  };

  const handleClose = () => {
    setStepName("");
  };

  const openFileExplorer = () => {
    setSelectedFiles("");
    setStepName("fileExplorerOpen");
  };

  const closeFileExplorer = () => {
    setStepName("openModal");
  };

  const handleFolderSelect = (file) => {
    setSelectedFiles(file);
  };

  const handlefileName = (file) => {
    setfileNames(file);
  };

  const ModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 160,
    bgcolor: "white",
    border: "2px solid white",
    borderRadius: "25px",
    p: 5,
  };
  const FileExplorerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 600,
    overflowY: "auto",
    bgcolor: "white",
    border: "2px solid white",
    borderRadius: "25px",
    p: 5,
  };

  useEffect(() => {
    if (setNodes) {
      setNodes((nds) =>
        nds.map((node) => {
          if (edges.some((edge) => node.id === edge.target)) {
            return {
              ...node,
              data: {
                ...node.data,
                inputFiles: selectedFiles,
              },
            };
          }
          return node;
        })
      );
    }
  }, [selectedFiles, inputFiles, edges, id, setNodes]);

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div>
      <InsertDriveIcon
        style={{
          fontSize: "3em",
          color: fileNames.length > 0 ? "#1976d2" : "grey",
          cursor: "pointer",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <SettingsIcon
          fontSize="1"
          style={{ cursor: "pointer" }}
          onClick={handleOpen}
        />
        <Modal
          open={stepName === "openModal"}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={ModalStyle}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Select MassSpec files
            </Typography>
            <div style={{ paddingTop: "10px" }}>
              <Button onClick={openFileExplorer} variant="contained">
                See Files
              </Button>
            </div>
            {selectedFiles && (
              <div style={{ position: "absolute", top: 110 }}>
                <h3>Selected Files:</h3>
                <h5>
                  {fileNames.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </h5>
              </div>
            )}
          </Box>
        </Modal>

        <Modal
          open={stepName === "fileExplorerOpen"}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={ModalStyle}>
            <Box sx={FileExplorerStyle}>
              {" "}
              <IconButton
                aria-label="close"
                onClick={handleOpen}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
              <SelectMzml
                onFolderSelect={handleFolderSelect}
                onfileName={handlefileName}
                handleClose={closeFileExplorer}
              />
            </Box>
          </Box>
        </Modal>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        style={{ background: "blue" }}
      >
        <p style={{ fontSize: "9px", position: "absolute", top: -12, left: 8 }}>
          send
        </p>
      </Handle>
    </div>
  );
};

export default MassSpecFiles;
