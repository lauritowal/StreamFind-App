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
import { Button, MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const handleStyle = { left: 10 };

function MsProcessing({
  type,
  id,
  data: { label, edges, find_features, group_features, setNodes },
  isConnectable,
}) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  console.log(find_features);

  const [findFeatures, setFindFeatures] = useState([]);
  const [params, setParams] = useState([]);
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
      fileNames: find_features,
      algorithm: algo,
    };
    axios
      .post("http://127.0.0.1:8000/find_features", requestData)
      .then((response) => {
        console.log("Getting features", response);
        console.log(response.data);
        setFindFeatures(response.data.file_name);
        setOpenObj(true);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
        console.log(requestData);
      });
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
                group_features: findFeatures,
              },
            };
          }
          return node;
        })
      );
    }
  }, [findFeatures, group_features, edges, id, setNodes]);

  const getParameters = () => {
    const requestData = {
      fileNames: find_features,
      algorithm: algo,
    };
    axios
      .post("http://127.0.0.1:8000/get_parameters", requestData)
      .then((response) => {
        console.log("Getting Parameters", response);
        setParams(response.data.parameters);
        setOpenModal(true);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
        console.log(requestData);
      });
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
          onClick={getParameters}
          style={{ cursor: "pointer" }}
          fontSize="1"
        />
      </div>
      <p style={{ fontSize: "7px", position: "absolute", top: 45, left: -9 }}>
        find_features
      </p>
      <PlayIcon
        onClick={openSelectAlgo}
        style={{
          color: find_features.length > 0 ? "green" : "red",
          cursor: "pointer",
          fontSize: "10px",
          position: "absolute",
          top: -10,
          left: 19,
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
              <MenuItem value="qPeaks">qPeaks</MenuItem>
              <MenuItem value="xcms3_centwave">xcms3_centwave</MenuItem>
              <MenuItem value="xcms3_matchedfilter">
                xcms3_matchedfilter
              </MenuItem>
              <MenuItem value="openms">openms</MenuItem>
              <MenuItem value="kpic2">kpic2ß</MenuItem>
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
              find_features applied with {algo}!
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
            find_features={findFeatures}
            handleClose={handleClose}
            params={params}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default MsProcessing;
