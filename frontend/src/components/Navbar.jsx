import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <Box
      sx={{
        borderBottom: '1px solid #2e3c51',
        background: 'black',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '4rem',
        px: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        component={Link}
        to="/"
        sx={{ textDecoration: 'none' }}
      >
        <img
          src="b.svg"
          alt="logo"
          style={{
            display: 'block',
            width: '50px',
          }}
        />
        <Typography variant="body" px={1} style={{
            fontSize: '25px',
            color: 'whitesmoke',
        }}>
          BLOCKMORPH
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <img src="./metamask-logo.png" alt="Credit Icon" style={{width: '50px'}} />
        <Typography variant="body" px={1} style={{color: 'grey'}}>
          chappa maar
        </Typography>
      </Box>
    </Box>
  );
}

export default Navbar;