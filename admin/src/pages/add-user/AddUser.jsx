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

const AddUser = () => {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleNav = () => {
    navigate(-1);
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleChange = (e) => {
    const { target } = e;
    setFormInputs({ ...formInputs, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("firstname", formInputs.firstname.trim());
    data.append("lastname", formInputs.lastname.trim());
    data.append("email", formInputs.email.trim());
    data.append("phoneNumber", formInputs.phoneNumber.trim());
    data.append("password", formInputs.password.trim());
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/usersignup`, {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          localStorage.setItem("token", data.token);
          navigate("/users");
        } else {
          enqueueSnackbar(data.error, { variant: "error" });
          setIsLoading(false);
        }
      });
  };

  return (
    <Page title="Add User">
      <Container maxWidth="xl">
        <NavBackHeader heading="Add User" />
        <Container maxWidth="xl">
          <ContentStyle>
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  value={formInputs.firstname}
                  onChange={handleChange}
                  name="firstname"
                  required
                  fullWidth
                  type="text"
                  label="Last Name"
                />

                <TextField
                  value={formInputs.lastname}
                  onChange={handleChange}
                  name="lastname"
                  required
                  fullWidth
                  type="text"
                  label="First Name"
                />

                <TextField
                  value={formInputs.email}
                  onChange={handleChange}
                  name="email"
                  required
                  fullWidth
                  type="email"
                  label="Email address"
                />
                
                <TextField
                  value={formInputs.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                  required
                  fullWidth
                  type="tel"
                  label="Phone Number"
                />

                <TextField
                  value={formInputs.password}
                  onChange={handleChange}
                  fullWidth
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                Create
              </LoadingButton>
            </form>
          </ContentStyle>
        </Container>
      </Container>
    </Page>
  );
};

export default AddUser;
