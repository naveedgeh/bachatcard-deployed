import { IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components';
import PropTypes from 'prop-types';

const NavBackHeader = ({ heading, sx }) => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate(-1);
  };
  return (
    <Stack sx={{ ...sx }} direction='row'>
      <IconButton onClick={handleNav} className='me-1'>
        <Iconify icon='ep:back' />
      </IconButton>
      <Typography variant='h4'>{heading ? heading : 'Untitled'}</Typography>
    </Stack>
  );
};
NavBackHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  sx: PropTypes.object,
};
export default NavBackHeader;
