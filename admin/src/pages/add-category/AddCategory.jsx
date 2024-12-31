import { useState } from "react";
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBackHeader, Page } from "src/components";
import { Stack, TextField, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "../../components/Iconify";
import { useSnackbar } from "notistack";

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 580,
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  padding: theme.spacing(6, 2),
}));

const AddCategory = () => {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({ name: "", image: null });
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
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("name", formInputs.name.trim());
    if (formInputs.image) {
      console.log(formInputs)
      data.append("image", formInputs.image);
    }
    setIsLoading(true);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/categories`, {
        method: "POST",
        body: data,
      });
  
      const responseData = await response.json();
      if (response.ok) {
        navigate("/categories");
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
    <Page title="Add Category">
      <Container maxWidth="xl">
        <NavBackHeader heading="Add Category" />
        <Container maxWidth="xl">
          <ContentStyle>
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  value={formInputs.name}
                  onChange={handleChange}
                  name="name"
                  required
                  fullWidth
                  type="text"
                  label="Category Name"
                />

                <TextField
                  onChange={handleChange}
                  name="image"
                  required
                  fullWidth
                  type="file"
                />
              </Stack>

              <LoadingButton
                sx={{ my: 3 }}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isLoading}
              >
                Add Category
              </LoadingButton>
            </form>
          </ContentStyle>
        </Container>
      </Container>
    </Page>
  );
};

export default AddCategory;
