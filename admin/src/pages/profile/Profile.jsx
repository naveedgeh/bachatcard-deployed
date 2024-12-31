import { Container, Typography } from '@mui/material';
import React from 'react';
import { Page, RichEditor } from 'src/components';

const Profile = () => {
  return (
    <Page title='Profile'>
      <Container maxWidth='xl'>
        <Typography variant='h4' gutterBottom>
          Profile
        </Typography>
      </Container>
    </Page>
  );
};

export default Profile;
