import { Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import MainCard from 'components/MainCard';

const Card = ({ title, count, variant }) => {
  const theme = useTheme();

  const bgColor = (() => {
    switch (variant) {
      case 'todo':
        return theme.palette.primary.lighter;
      case 'inprogress':
        return theme.palette.warning.lighter;
      case 'completed':
        return theme.palette.success.lighter;
      default:
        return theme.palette.error.lighter;
    }
  })(variant);

  return (
    <MainCard contentSX={{ p: 2.25, backgroundColor: bgColor }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textPrimary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
};

export default Card;
