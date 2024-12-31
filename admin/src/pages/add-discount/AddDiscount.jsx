import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NavBackHeader, Page } from "src/components";
import {
  Stack,
  TextField,
  Select,
  FormControl,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 580,
  display: "flex",
  justifyContent: "start",
  flexDirection: "column",
  padding: theme.spacing(6, 2),
}));

const AddDiscount = () => {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({
    name: "",
    category: "",
    brand: "",
    image: null,
    percentage: "",
    price: "",
    title: "",
    description: "",
    address: "",
    deal: false,
    endDate: "",
    endTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setbrands] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/user/getallbrands`
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setbrands(data.data);
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while fetching Brands", {
        variant: "error",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/categories`
      );
      const data = await response.json();
      if (response.ok) {
        setCategories(data.data);
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while fetching categories", {
        variant: "error",
      });
    }
  };

  const handleNav = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value, files, checked } = e.target;
    if (name === "image") {
      setFormInputs((prevState) => ({
        ...prevState,
        image: files[0], // Only take the first file if multiple files are selected
      }));
    } else if (name === "deal") {
      setFormInputs((prevState) => ({
        ...prevState,
        deal: checked,
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
    data.append("category", formInputs.category);
    data.append("brand", formInputs.brand);
    data.append("percentage", formInputs.percentage);
    data.append("price", formInputs.price);
    data.append("title", formInputs.title);
    data.append("description", formInputs.description);
    data.append("address", formInputs.address);
    data.append("deal", formInputs.deal);
    data.append("endDate", formInputs.endDate);
    data.append("endTime", formInputs.endTime);
    if (formInputs.image) {
      data.append("image", formInputs.image);
    }
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/discounts`,
        {
          method: "POST",
          body: data,
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        navigate("/discounts");
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

  return (
    <Page title="Add Discount">
      <Container maxWidth="xl">
        <NavBackHeader heading="Add Discount" />
        <Container maxWidth="xl">
          <ContentStyle>
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  value={formInputs.category}
                  onChange={handleChange}
                  name="category"
                  required
                  select
                  label="Select Category"
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  value={formInputs.brand}
                  onChange={handleChange}
                  name="brand"
                  required
                  select
                  label="Select Brand"
                >
                  <MenuItem value="" disabled>
                    Select Brand
                  </MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand._id}>
                      {brand.brandname}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  value={formInputs.price}
                  onChange={handleChange}
                  name="price"
                  required
                  fullWidth
                  type="number"
                  label="Price"
                />

                <TextField
                  value={formInputs.percentage}
                  onChange={handleChange}
                  name="percentage"
                  required
                  fullWidth
                  type="number"
                  label="Percentage"
                />

                <TextField
                  value={formInputs.title}
                  onChange={handleChange}
                  name="title"
                  required
                  fullWidth
                  type="text"
                  label="Title"
                />

                <TextField
                  value={formInputs.address}
                  onChange={handleChange}
                  name="address"
                  required
                  fullWidth
                  type="text"
                  label="Address"
                />

                <TextField
                  value={formInputs.description}
                  onChange={handleChange}
                  name="description"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      value={formInputs.deal}
                      onChange={handleChange}
                      name="deal"
                      color="primary"
                    />
                  }
                  label="Deal of the Day?"
                />

                <TextField
                  value={formInputs.endDate}
                  onChange={handleChange}
                  name="endDate"
                  required
                  fullWidth
                  type="date"
                  label="End Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  value={formInputs.endTime}
                  onChange={handleChange}
                  name="endTime"
                  required
                  fullWidth
                  type="time"
                  label="End Time"
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                Add Discount
              </LoadingButton>
            </form>
          </ContentStyle>
        </Container>
      </Container>
    </Page>
  );
};

export default AddDiscount;
