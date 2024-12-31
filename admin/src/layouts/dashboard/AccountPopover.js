import { useRef, useState } from 'react';
import { Link as RouterLink, matchPath, useLocation, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
//hooks
import { useAppContext } from 'src/hooks';

// ----------------------------------------------------------------------

// const MENU_OPTIONS = [
//   {
//     label: 'Profile',
//     icon: 'eva:person-fill',
//     path: '/profile',
//   },
//   {
//     label: 'Settings',
//     icon: 'eva:settings-2-fill',
//     path: '/settings',
//   },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const { _get_user_profile } = useAppContext();
  const profile = _get_user_profile();
  const { pathname } = useLocation();

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {profile.image ? (
          <>
            <Avatar src={profile.image} alt='photoURL' />
          </>
        ) : (
          <>
            <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.main }}>
              {profile.first_name.charAt(0)}
            </Avatar>
          </>
        )}
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant='subtitle2' noWrap>
            {profile.first_name + profile.last_name}
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
            {profile.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              to={option.path}
              component={RouterLink}
              // onClick={() => handleNavigate(option.path)}
              sx={{
                color: match(option.path) ? (theme) => theme.palette.primary.main : 'black',
                bgcolor: match(option.path)
                  ? (theme) =>
                      alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
                  : '',
              }}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
