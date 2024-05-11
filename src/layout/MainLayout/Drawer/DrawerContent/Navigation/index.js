import { Box } from '@mui/material';

import NavItem from './NavItem';
import menuItem from 'menu-items';

const Navigation = () => {
  return (
    <Box sx={{ pt: 2 }}>
      {menuItem.items.map((item) => {
        return item.children?.map((menuItem) => {
          return <NavItem key={menuItem.id} item={menuItem} level={1} />;
        });
      })}
    </Box>
  );
};

export default Navigation;
