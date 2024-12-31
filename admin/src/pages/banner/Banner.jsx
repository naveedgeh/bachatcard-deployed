import { useState } from "react";
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBackHeader, Page } from "src/components";
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 580,
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  padding: theme.spacing(6, 2),
}));

const AddBanner = () => {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({ images: ["", "", ""] });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleNav = () => {
    navigate(-1);
  };

  const handleChange = (e, index) => {
    const { files } = e.target;
    const images = Array.from(files);
    const updatedImages = [...formInputs.images];
    updatedImages[index] = images[0];
    setFormInputs((prevState) => ({
      ...prevState,
      images: updatedImages,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    formInputs.images.forEach((image, index) => {
      data.append(`image[${index}]`, image);
    });
  
    setIsLoading(true);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/banner`, {
        method: "POST",
        body: data,
      });
  
      const responseData = await response.json();
      if (response.ok) {
        enqueueSnackbar(responseData.message, { variant: "success" });
        // Clear input fields after successful submission
        setFormInputs({ images: ["", "", ""] });
      } else {
        enqueueSnackbar(responseData.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while submitting the form", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page title="Banner">
      <Container maxWidth="xl">
        <NavBackHeader heading="Banner" />
        <Container maxWidth="xl">
          <ContentStyle>
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {formInputs.images.map((image, index) => (
                  
                  <TextField
                    key={index}
                    onChange={(e) => handleChange(e, index)}
                    name={`image[${index}]`}
                    fullWidth
                    type="file"
                  />
                ))}
              </Stack>

              <LoadingButton
                sx={{ my: 3 }}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isLoading}
              >
                Upload Banner
              </LoadingButton>
            </form>
          </ContentStyle>
        </Container>
      </Container>
    </Page>
  );
};

export default AddBanner;
