import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBackHeader, Page } from "src/components";
import { Stack, TextField, MenuItem, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 580,
  display: "flex",
  justifyContent: "start",
  flexDirection: "column",
  padding: theme.spacing(6, 2),
}));

const AddLuckyDraw = () => {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({ timeframe: "", items: [] });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleNav = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormInputs((prevState) => ({
        ...prevState,
        image: files[0], // Only take the first file if multiple files are selected
      }));
    } else {
      setFormInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    console.log(formInputs)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsLoading(true);
  
    try {
      const data = new FormData();
      const timeframe = formInputs.timeframe.split(" ")
      data.append("duration", timeframe[0]);
      data.append("type", timeframe[1]);
      formInputs.items.forEach((item, index) => {
        data.append("items", item); // Append each item with the same key name
      });
  
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/luckydraws`,
        {
          method: "POST",
          body: data,
        }
      );
  
      const responseData = await response.json();
      if (response.ok) {
        enqueueSnackbar("Lucky draw added successfully", { variant: "success" });
        navigate("/luckydraws");
      } else {
        enqueueSnackbar(responseData.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while submitting the form", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleAddItem = () => {
    setFormInputs((prevState) => ({
      ...prevState,
      items: [...prevState.items, ""],
    }));
  };

  const handleItemChange = (index, value) => {
    const newItems = [...formInputs.items];
    newItems[index] = value;
    setFormInputs((prevState) => ({
      ...prevState,
      items: newItems,
    }));
  };

  return (
    <Page title="Add Lucky Draw">
      <Container maxWidth="xl">
        <NavBackHeader heading="Add Lucky Draw" />
        <Container maxWidth="xl">
          <ContentStyle>
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  value={formInputs.timeframe}
                  onChange={handleChange}
                  name="timeframe"
                  required
                  select
                  label="Select Time Frame"
                >
                  <MenuItem key="1" value="1 day">
                    1 Day
                  </MenuItem>
                  <MenuItem key="1" value="1 month">
                    1 Month
                  </MenuItem>
                  <MenuItem key="3" value="3 month">
                    3 Months
                  </MenuItem>
                  <MenuItem key="6" value="6 month">
                    6 Months
                  </MenuItem>
                  <MenuItem key="12" value="12 month">
                    12 Months
                  </MenuItem>
                </TextField>
                {formInputs.items.map((item, index) => (
                  <TextField
                    key={index}
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    name={`item${index}`}
                    required
                    fullWidth
                    type="text"
                    label={`Lucky Draw Item ${index + 1}`}
                  />
                ))}
                <Button onClick={handleAddItem} variant="outlined">
                  Add Item
                </Button>
              </Stack>

              <LoadingButton
                sx={{ my: 3 }}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isLoading}
              >
                Add Lucky Draw
              </LoadingButton>
            </form>
          </ContentStyle>
        </Container>
      </Container>
    </Page>
  );
};

export default AddLuckyDraw;
