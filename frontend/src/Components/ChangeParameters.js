import React, { useState, useEffect } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { FormControl, Input, InputLabel, Button, Checkbox } from "@mui/material";

function ChangeParameters({
  find_features,
  group_features,
  algo,
  version,
  handleClose,
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
        const parsedParameters = {};

      // Iterate through response.data.parameters and parse values
      Object.keys(response.data.parameters).forEach((key) => {
        try{
          const parsedValue = JSON.parse(response.data.parameters[key][0]);
          console.log(typeof parsedValue);
          parsedParameters[key] = parsedValue;
	      } catch {
	        const parsedValue = response.data.parameters[key][0];
          parsedParameters[key] = parsedValue;
	      }
        
      });

      console.log(parsedParameters); // This will log the parsed parameters
      setFormState(parsedParameters);
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
    } else if (group_features !== undefined) {
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
    return <div>Loading...</div>
  }

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
      <FormControl onSubmit={handleSubmit}>
  {Object.keys(formState).map((paramName) => (
    <div
      key={paramName}
      style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
    >
      <label
        htmlFor={paramName}
        style={{
          flex: "1",
          textAlign: "right",
          paddingRight: "10px",
          marginRight: "10px", // Add spacing between label and input/checkbox
          minWidth: "150px"
        }}
      >
        {paramName}
      </label>
      {paramName === 'class' ? (
        // Display class parameter as text (non-editable)
        <div style={{ flex: "2", textAlign: "center" }}>{formState[paramName]}</div>
      ) : typeof formState[paramName] === "boolean" ? (
        // Display boolean parameters as checkboxes
        <Checkbox
          id={paramName}
          style={{ flex: "2", textAlign: "center" }}
          checked={formState[paramName]}
          onChange={(e) => handleChange(paramName, e.target.checked)} 
        />
      ) : typeof formState[paramName] === "number" ? (
        // Display numeric parameters as input fields
        <Input
          type="number"
          id={paramName}
          style={{ flex: "2", textAlign: "center" }}
          value={formState[paramName]}
          onChange={(e) => handleChange(paramName, e.target.value)}
        />
      ) : (
        // Display other parameters as input fields
        <Input
          type="text"
          id={paramName}
          style={{ flex: "2", textAlign: "center" }}
          value={formState[paramName]}
          onChange={(e) => handleChange(paramName, e.target.value)}
        />
      )}
    </div>
  ))}
  <Button
    style={{ paddingTop: "30px" }}
    onClick={handleSubmit}
    type="submit"
  >
    Submit
  </Button>
</FormControl>
    </div>
  );
}

export default ChangeParameters;