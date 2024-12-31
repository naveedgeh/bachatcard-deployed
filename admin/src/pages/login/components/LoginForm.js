import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
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
    data.append('email', formInputs.email.trim());
    data.append('password', formInputs.password.trim());
    setIsLoading(true);
    fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/login`,
      {
        method: "POST",
        body: data,
      }
    )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.code);
      if (data.success === true) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }   
    })
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          value={formInputs.email}
          onChange={handleChange}
          name='email'
          required
          fullWidth
          autoComplete='username'
          type='email'
          label='Email address'
        />

        <TextField
          value={formInputs.password}
          onChange={handleChange}
          fullWidth
          name='password'
          required
          autoComplete='current-password'
          type={showPassword ? 'text' : 'password'}
          label='Password'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={handleShowPassword} edge='end'>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton sx={{ my: 3 }} fullWidth size='large' type='submit' variant='contained' loading={isLoading}>
        Login
      </LoadingButton>
    </form>
  );
}
