import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { styled } from '@mui/material/styles';
// ==============================

const Centered = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '45%',
  left: '50vw',
  transform: 'translate(-50%,-50%)',
  [theme.breakpoints.up('lg')]: {
    left: '57vw',
  },
}));
const CircularLoader = ({ size }) => {
  return (
    <Centered>
      <CircularProgress size={size ? size : '3rem'} />
    </Centered>
  );
};
export default CircularLoader;
CircularLoader.propTypes = {
  size: PropTypes.string,
};
