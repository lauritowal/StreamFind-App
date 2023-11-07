import { useCallback, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayIcon from "@mui/icons-material/PlayCircle";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "../../index.css";
import MsDataDetails from "../MsDataDetails";
import FindFeatures from "./FindFeatures";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

const handleStyle = { left: 10 };

function MassSpecData({
  id,
  data: { label, edges, find_features, inputFiles, setNodes },
  isConnectable,
}) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [color, setColor] = useState(false);
  const [msDataDetails, setMsDataDetails] = useState([]);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpenDialog(false);
  };

  const ModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1500,
    height: 800,
    bgcolor: "white",
    border: "2px solid white",
    borderRadius: "25px",
    p: 5,
  };
  const DialogStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    height: 85,
    bgcolor: "white",
    border: "2px solid white",
    borderRadius: "25px",
    p: 5,
  };

  const createMsDataObj = () => {
    axios
      .post("http://127.0.0.1:8000/msdata", inputFiles)
      .then((response) => {
        console.log("MsData Object created!", response);
        setMsDataDetails(response.data);
        setOpenDialog(true);
        setColor(true);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
      });
  };

  const showDetails = () => {
    setOpenModal(true);
    console.log("Details!");
    console.log(msDataDetails);
  };

  useEffect(() => {
    if (setNodes) {
      setNodes((nds) =>
        nds.map((node) => {
          if (edges.some((edge) => edge.target === node.id)) {
            return {
              ...node,
              data: {
                ...node.data,
                find_features: msDataDetails,
              },
            };
          }
          return node;
        })
      );
    }
  }, [msDataDetails, find_features, edges, id, setNodes]);

  return (
    <div>
      <FolderIcon
        style={{ fontSize: "3em", color: "orange", cursor: "pointer" }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 40,
        }}
      >
        <SettingsIcon
          onClick={showDetails}
          style={{ cursor: "pointer" }}
          fontSize="1"
        />
      </div>
      <Handle
        type="target"
        style={{ background: "green" }}
        position={Position.Left}
        isConnectable={isConnectable}
      >
        <p
          style={{ fontSize: "9px", position: "absolute", top: -12, left: -9 }}
        >
          in
        </p>
      </Handle>
      <Handle
        type="source"
        style={{ background: "blue" }}
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      >
        <p style={{ fontSize: "9px", position: "absolute", top: -12, left: 8 }}>
          out
        </p>
      </Handle>
      <PlayIcon
        onClick={createMsDataObj}
        style={{
          color: color ? "green" : "red",
          cursor: "pointer",
          fontSize: "10px",
          position: "absolute",
          top: -6,
          left: 19,
        }}
      />
      <Modal
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={DialogStyle}>
          <IconButton
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <div style={{ display: "flex" }}>
            <CheckCircleIcon sx={{ color: "green", marginRight: "4px" }} />
            <Typography id="modal-modal-title" variant="h9" component="h2">
              MassSpec data object created!
            </Typography>
            <Button
              style={{ position: "absolute", right: 300, top: 110 }}
              onClick={handleClose}
              variant="contained"
            >
              OK
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <MsDataDetails
            msDataDetails={msDataDetails}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default MassSpecData;
