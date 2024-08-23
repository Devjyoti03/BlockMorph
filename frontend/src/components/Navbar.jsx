import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

function Navbar() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.log("MetaMask not found");
    }
  };

  return (
    <div className='bg-gray-gradient'>
    <Box
      sx={{
        borderBottom: '1px solid #2e3c51',
        // background: 'black',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '4rem',
        px: 3,
        zIndex: '10'
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
        {account ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box sx={{ display: 'flex' }} mr={1}>
                  <img
                    src="bc.svg"
                    alt="text"
                    style={{
                      display: 'block',
                      width: '1.4rem',
                    }}
                  />
                  <Typography variant="h5">
                    10 
                  </Typography>
                </Box>
        <img src="./metamask-logo.png" alt="Credit Icon" style={{width: '50px'}} />
        <Typography variant="body" px={1} style={{color: 'black', 
              padding: "10px", borderRadius: "10px"}} className='eth-card'>
            {account.slice(0, 6)}...{account.slice(-4)}
          </Typography>
          
        </Box>
        ) : (
          <Button
            onClick={connectWallet}
            variant="contained"
            style={{
              backgroundColor: 'orange',
              color: 'black',
            }}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
    </Box>
    </div>
  );
}

export default Navbar;
