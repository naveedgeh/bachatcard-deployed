// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { Page } from 'src/components';
import LoginForm from './components/LoginForm';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title='Login'>
      <RootStyle>

        {mdUp && (
          <SectionStyle>
            {/* <Typography variant='h3' sx={{ px: 5, mt: 12, mb: 5 }}>
              Hi, Welcome Back
            </Typography> */}
            <img style={{width: '240px'}} src="logo.png" alt="logo" />
          </SectionStyle>
        )}

        <Container maxWidth='sm'>
          <ContentStyle>
            <Typography variant='h4' gutterBottom>
              Login
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 7 }}>
              Enter your details below.
            </Typography>

            <LoginForm />

          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
