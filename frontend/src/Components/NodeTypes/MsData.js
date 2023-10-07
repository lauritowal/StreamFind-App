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
import MsProcessing from "./MsProcessing";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const handleStyle = { left: 10 };

function MsData({
  id,
  data: { label, edges, find_features, inputFiles, setNodes },
  isConnectable,
}) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  console.log(inputFiles);
  console.log(edges);
  const [openModal, setOpenModal] = useState(false);
  const [openObj, setOpenObj] = useState(false);
  const [color, setColor] = useState(false);
  const [msDataObj, setMsDataObj] = useState([]);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpenObj(false);
  };

  const style = {
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
  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    height: 50,
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
        setMsDataObj(response.data);
        setOpenObj(true);
        setColor(true);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
      });
  };

  const showDetails = () => {
    setOpenModal(true);
    console.log("Details!");
    console.log(msDataObj);
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
                find_features: msDataObj,
              },
            };
          }
          return node;
        })
      );
    }
  }, [msDataObj, find_features, edges, id, setNodes]);

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
        open={openObj}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
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
            <CheckCircleIcon />
            <Typography id="modal-modal-title" variant="h9" component="h2">
              msData Object created!
            </Typography>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MsDataDetails msDataObj={msDataObj} handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
}

export default MsData;
