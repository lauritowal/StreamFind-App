import React, { useState, useEffect } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  Input,
  InputLabel,
  Button,
  Checkbox,
  Grid,
} from "@mui/material";
import { Link } from "react-dom";

function ChangeParameters({
  find_features,
  group_features,
  algo,
  version,
  handleClose,
}) {
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(true);
  const non_changeable = [
    "class",
    "call",
    "algorithm",
    "version",
    "software",
    "developer",
    "contact",
    "link",
    "doi",
  ];

  useEffect(() => {
    async function fetchParameters() {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/get_parameters",
          {
            algorithm: algo,
            fileNames: find_features ? find_features : group_features,
            type: find_features ? "find_features" : "group_features",
          }
        );
        const parsedParameters = {};

        Object.keys(response.data.p_settings).forEach((key) => {
          //console.log("Value: ",  response.data.p_settings[key]);
          const parsedValue = response.data.p_settings[key];
          parsedParameters[key] = parsedValue;
        });

        // Iterate through response.data.parameters and parse values
        console.log(response.data.parameters);
        Object.keys(response.data.parameters).forEach((key) => {
          // console.log(key, typeof key);
          if (key == "groupParam") {
            Object.keys(response.data.parameters.groupParam).forEach((key) => {
              try {
                const parsedValue = JSON.parse(
                  response.data.parameters.groupParam[key]
                );
                console.log("Parsed", key, parsedValue);
                parsedParameters[key] = parsedValue;
              } catch {
                const parsedValue = response.data.parameters.groupParam[key];
                console.log("Not Parsed", key, parsedValue);
                parsedParameters[key] = parsedValue;
              }
            });
          } else {
            try {
              const parsedValue = JSON.parse(response.data.parameters[key]);
              console.log("Parsed", key, parsedValue);
              parsedParameters[key] = parsedValue;
            } catch {
              const parsedValue = response.data.parameters[key];
              console.log("Not Parsed", key, parsedValue);
              parsedParameters[key] = parsedValue;
            }
          }
        });

        //console.log(parsedParameters); // This will log the parsed parameters
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
    return <div>Loading...</div>;
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
        Settings
      </Typography>
      {non_changeable.map((paramName) => (
        <Grid container style={{ paddingRight: "50px", paddingBottom: "10px" }}>
          <Grid item md={4}>
            <div key={paramName}>
              <label htmlFor={paramName}>{paramName}</label>
            </div>
          </Grid>
          <Grid item md={8}>
            <div>
              {paramName === "contact" ? (
                <a
                  href={`mailto:${formState[paramName]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2" }}
                >
                  {formState[paramName]}
                </a>
              ) : ["link", "doi"].includes(paramName) ? (
                <a
                  href={formState[paramName]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2" }}
                >
                  {formState[paramName]}
                </a>
              ) : (
                formState[paramName]
              )}
            </div>
          </Grid>
        </Grid>
      ))}
      {Object.keys(formState)
        .filter((paramName) => !non_changeable.includes(paramName))
        .map((paramName) => (
          <Grid
            container
            style={{
              paddingRight: "40px",
              paddingBottom: "10px",
              justifyContent: "flex-start",
            }}
            spacing={1}
          >
            <Grid item md={4}>
              <div key={paramName}>
                <label htmlFor={paramName}>{paramName}</label>
              </div>
            </Grid>
            <FormControl onSubmit={handleSubmit}>
              <Grid item md={8}>
                <div>
                  {typeof formState[paramName] === "boolean" ? (
                    <div style={{ marginLeft: "-10px" }}>
                      <Checkbox
                        id={paramName}
                        checked={formState[paramName]}
                        onChange={(e) =>
                          handleChange(paramName, e.target.checked)
                        }
                      />
                    </div>
                  ) : typeof formState[paramName] === "number" ? (
                    <Input
                      type="number"
                      id={paramName}
                      value={formState[paramName]}
                      onChange={(e) =>
                        handleChange(paramName, parseFloat(e.target.value))
                      }
                    />
                  ) : (
                    <div>
                      <Input
                        type="text"
                        id={paramName}
                        value={formState[paramName]}
                        onChange={(e) =>
                          handleChange(paramName, e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              </Grid>
            </FormControl>
          </Grid>
        ))}
      <div style={{ paddingTop: "10px" }}>
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
        >
          Update Settings
        </Button>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default ChangeParameters;
