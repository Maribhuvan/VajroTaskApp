import { Grid } from '@mui/material';

import logo from 'assets/images/logo.svg';

const LogoSection = ({sx}) => {
  return (
    <Grid sx={sx}>
      <img src={logo} alt="Vajro" width="100" />
    </Grid>
  );
};

export default LogoSection;
