import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Plot from "react-plotly.js";
import MzmlFileDetails from "./MzmlFileDetails";

function MsDataDetails({ msDataObj, handleClose }) {
  const [stepName, setStepName] = useState("");
  const [overview, setOverview] = useState([]);
  const [analyses_number, setAnalyses_number] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [plot, setPlot] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleOpen = (fileName) => {
    setSelectedFileName(fileName);
    setOpenModal(true);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1500,
    height: 700,
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

  useEffect(() => {
    axios
      .post("http://127.0.0.1:8000/msdatadetails", msDataObj)
      .then((response) => {
        console.log("Getting Details!", response);
        setOverview(response.data.overview);
        const parsedAnalysesData = JSON.parse(response.data.analysesjson);
        setAnalyses(parsedAnalysesData);
        setAnalyses_number(response.data.analyses_number);
        const parsedPlotData = JSON.parse(response.data.plotjson);
        setPlot(parsedPlotData);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
      });
  }, [msDataObj]);

  return (
    <div>
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
        Analysis Table
      </Typography>
      <table className="table-container">
        <thead>
          <tr>
            <th>file</th>
            <th>Analysis</th>
            <th>Replicate</th>
            <th>Blank</th>
            <th>class</th>
            <th>polarity</th>
          </tr>
        </thead>
        <tbody>
          {overview.map((item) => (
            <tr
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleOpen(item.analysis)}
            >
              <td>{item.file}</td>
              <td>{item.analysis}</td>
              <td>{item.replicate}</td>
              <td>{item.blank}</td>
              <td>{item.type}</td>
              <td>{item.polarity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Plot
        style={{ position: "absolute", top: 340, left: 100 }}
        data={plot.data}
        layout={plot.layout}
      />
      <Button
        variant="outlined"
        onClick={handleClose}
        size="large"
        color="primary"
        style={{ position: "absolute", top: 700, left: 1300 }}
      >
        Save msData
      </Button>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MzmlFileDetails
            selectedFileName={selectedFileName}
            msDataObj={msDataObj}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default MsDataDetails;
