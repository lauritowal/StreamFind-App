import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Plot from "react-plotly.js";

function MzmlFileDetails({ selectedMzml, msDataDetails, handleClose }) {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    const requestData = {
      fileName: selectedMzml,
      msdata: msDataDetails,
    };
    axios
      .post("http://127.0.0.1:8000/mzmldetails", requestData)
      .then((response) => {
        console.log("Getting Details!", response);
        const parsedAnalysesData = JSON.parse(response.data.analysesjson);
        setAnalyses(parsedAnalysesData);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
      });
  }, [msDataDetails, selectedMzml]);
  const indices = [0, 1, 2, 4, 5, 7, 8, 9, 15, 21, 14, 23];

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
        {selectedMzml}
      </Typography>
      <Typography
        id="modal-modal-title"
        variant="h9"
        component="h2"
      ></Typography>
      <table style={{ width: "30%" }}>
        <tbody>
          {indices.map((index) => (
            <tr key={index}>
              <td>{analyses?.value?.[0]?.attributes?.names?.value?.[index]}</td>
              <td>
                {index === 23
                  ? analyses?.value?.[0]?.value?.[index]?.value?.[0]?.value
                      ?.length
                  : analyses?.value?.[0]?.value?.[
                      index
                    ]?.value?.[0]?.toString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ paddingTop: "150px" }}>
        <Button onClick={handleClose} variant="contained">
          OK
        </Button>
      </div>
    </div>
  );
}

export default MzmlFileDetails;
