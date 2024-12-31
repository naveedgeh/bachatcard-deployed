import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';

// hooks
import useResponsive from '../../hooks/useResponsive';
import { useAppContext } from 'src/hooks';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
  boxShadow: "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;"
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

const LogoutContainer = styled('div')(({ theme }) => ({
  paddingInline: theme.spacing(2.5),
  paddingBlock: theme.spacing(1),
  marginTop: 15,
  backgroundColor: '#fff9f2',
  position: 'absolute',
  width: '100%',
  bottom: '0',
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { _get_user_profile } = useAppContext();
  const isDesktop = useResponsive('up', 'lg');
  const profile = _get_user_profile();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box
        sx={{
          px: 4.5,
          py: 2,
          display: 'inline-flex',
          alignItems: 'center',
          // justifyContent: 'center',
        }}
      >
        <img style={{width: '70px', marginBottom: "10px"}} src="logo.png" alt="logo" />
      </Box>

      <NavSection navConfig={navConfig} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
          <LogoutContainer>
            <Button onClick={handleLogout} variant='contained' fullWidth>
              Logout
            </Button>
          </LogoutContainer>
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant='persistent'
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: '#fff9f2',
            },
          }}
        >
          {renderContent}
          <LogoutContainer>
            <Button onClick={handleLogout} variant='contained' fullWidth>
              Logout
            </Button>
          </LogoutContainer>
        </Drawer>
      )}
    </RootStyle>
  );
}
