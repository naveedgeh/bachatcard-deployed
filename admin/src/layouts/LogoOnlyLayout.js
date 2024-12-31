import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
// components
import Logo from '../components/Logo';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (localStorage.getItem('token')) {
    if (pathname === '/login') {
      return <Navigate to='/dashboard' replace />;
    }
    if (pathname === '/register') {
      return <Navigate to='/dashboard' replace />;
    }
  }
  return (
    <>
      <HeaderStyle>
        <Logo />
      </HeaderStyle>
      <Outlet />
    </>
  );
}
