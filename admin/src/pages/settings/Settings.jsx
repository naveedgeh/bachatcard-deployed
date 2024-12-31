import { Container, Typography } from '@mui/material';
import React from 'react';
import { Page } from 'src/components';

const Settings = () => {
  return (
    <Page title='Settings'>
      <Container maxWidth='xl'>
        <Typography variant='h4' gutterBottom>
          Settings
        </Typography>
      </Container>
    </Page>
  );
};

export default Settings;
