import { useCallback, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayIcon from "@mui/icons-material/PlayCircle";
import axios from "axios";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChangeParameters from "../ChangeParameters";
import { Button } from "@mui/material";
import { MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const handleStyle = { left: 10 };

function GroupFeatures({
  type,
  data: { label, edges, group_features, setNodes },
  isConnectable,
}) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  console.log(group_features);

  const [groupFeatures, setGroupFeatures] = useState([]);
  const [algo, setAlgo] = useState("");
  const [openObj, setOpenObj] = useState(false);
  const [selectAlgo, setSelectAlgo] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    height: 100,
    bgcolor: "white",
    border: "2px solid white",
    borderRadius: "25px",
    p: 5,
  };
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    height: 400,
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
    height: 800,
    bgcolor: "white",
    border: "2px solid white",
    borderRadius: "25px",
    p: 5,
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpenObj(false);
    setSelectAlgo(false);
  };

  const openSelectAlgo = () => {
    setSelectAlgo(true);
  };

  const getFeatures = () => {
    const requestData = {
      fileNames: group_features,
      algorithm: algo,
    };
    axios
      .post("http://127.0.0.1:8000/group_features", requestData)
      .then((response) => {
        console.log("Getting group features", response);
        console.log(response.data);
        setGroupFeatures(response.data);
        console.log(groupFeatures);
        setOpenObj(true);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
      });
  };

  const changeParameters = () => {
    setOpenModal(true);
    console.log("Parameters!");
  };

  return (
    <div>
      <QueryStatsIcon style={{ fontSize: "3em", cursor: "pointer" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <SettingsIcon
          onClick={changeParameters}
          style={{ cursor: "pointer" }}
          fontSize="1"
        />
      </div>
      <p style={{ fontSize: "7px", position: "absolute", top: 45, left: -9 }}>
        group_features
      </p>
      <PlayIcon
        onClick={openSelectAlgo}
        style={{
          color: group_features.length > 0 ? "green" : "red",
          cursor: "pointer",
          fontSize: "10px",
          position: "absolute",
          top: -10,
          left: 18,
        }}
      />
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
      <Modal
        open={selectAlgo}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
          <Typography id="modal-modal-title" variant="h9" component="h2">
            Select Algorithm:
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Select</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={algo}
              onChange={(event) => setAlgo(event.target.value)}
            >
              <MenuItem value="xcms3_peakdensity">xcms3_peakdensity</MenuItem>
              <MenuItem value="xcms3_peakdenisty_peakgroups">
                xcms3_peakdenisty_peakgroups
              </MenuItem>
            </Select>
          </FormControl>
          <Button onClick={getFeatures}>Apply!</Button>
        </Box>
      </Modal>
      <Modal
        open={openObj}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
              group_features applied!
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
        <Box sx={style2}>
          <ChangeParameters
            handleClose={handleClose}
            group_features={groupFeatures}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default GroupFeatures;
