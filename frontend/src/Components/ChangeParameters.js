import React, { useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { FormControl, Grid } from "@mui/material";
import { Button, Input } from "@mui/material";

function ChangeParameters({
  find_features,
  handleClose,
  group_features,
  params,
}) {
  const [formState, setFormState] = useState(params);
  const handleChange = (paramName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [paramName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      parameters: formState,
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
            style={{ display: "flex", alignItems: "center" }}
          >
            <label
              htmlFor={paramName}
              style={{ flex: "1", textAlign: "right", paddingRight: "10px" }}
            >
              {paramName}
            </label>
            <Input
              type="text"
              id={paramName}
              inputProps={{ min: 0, style: { flex: "2", textAlign: "center" } }}
              value={formState[paramName]}
              onChange={(e) => handleChange(paramName, e.target.value)}
            />
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
