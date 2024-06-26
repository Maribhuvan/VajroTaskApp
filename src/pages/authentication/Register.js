import { Link } from 'react-router-dom';

import { Grid, Stack, Typography } from '@mui/material';

import AuthRegister from './auth-forms/AuthRegister';
import AuthWrapper from './AuthWrapper';
import Logo from '../../components/Logo';

const Register = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Logo sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0px 15px 30px 0px' }} />
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Sign up</Typography>
          <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Already have an account?
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthRegister />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Register;
