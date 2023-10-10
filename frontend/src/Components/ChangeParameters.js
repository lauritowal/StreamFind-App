import React, { useState, useEffect } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { FormControl, Input, InputLabel, Button } from "@mui/material";

function ChangeParameters({
  find_features,
  group_features,
  handleClose,
  algo,
  version,
}) {
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParameters() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/get_parameters", {
          algorithm: algo,
          fileNames: find_features ? find_features : group_features,
          type: find_features ? "find_features" : "group_features",
        });
        setFormState(response.data.parameters);
      } catch (error) {
        console.error("Error fetching parameters:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchParameters();
  }, [find_features, algo]);

  const handleChange = (paramName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [paramName]: value,
    }));
  };

  const handleSubmit = async () => {
    const requestData = {
      parameters: formState,
      algo: algo,
      version: version,
    };
    if (find_features !== undefined) {
      requestData.msData = find_features;
      requestData.data_type = "find_features";
    } else if (group_features !== undefined){
      requestData.msData = group_features;
      requestData.data_type = "group_features";
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/custom_find_features",
        requestData
      );
      console.log(requestData);
      console.log("Response from server:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(formState);

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
      <Typography style={{ paddingBottom: "10px" }} variant="h6" component="h2">
        Parameters
      </Typography>
      <form onSubmit={handleSubmit}>
        {Object.keys(formState).map((paramName) => (
          <FormControl fullWidth key={paramName}>
            <InputLabel htmlFor={paramName}>{paramName}</InputLabel>
            <Input
              id={paramName}
              type="text"
              value={formState[paramName]}
              onChange={(e) => handleChange(paramName, e.target.value)}
            />
          </FormControl>
        ))}
        <Button style={{ paddingTop: "30px" }} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default ChangeParameters;