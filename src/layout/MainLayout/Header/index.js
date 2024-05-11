import { Box, Grid, IconButton, AppBar, Toolbar, useMediaQuery } from '@mui/material';

import { LogoutOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';

import { styled } from '@mui/material/styles';

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from 'store/reducers/users';
import { useNavigate } from 'react-router-dom';

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: 260,
    width: `calc(100% - 260px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Header = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  };

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  const mainHeader = (
    <Toolbar>
      <IconButton
        disableRipple
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
      >
        {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }} />
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <Grid container>
          <Grid item sx={{ py: 0.5 }}>
            <IconButton size="large" color="error" onClick={handleLogout}>
              <LogoutOutlined />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Toolbar>
  );

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

export default Header;
