import { Box, FormControl, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { FaMagic } from 'react-icons/fa';

function LinkInput({ isDisabled, defaultValue, ...rest }) {
  const [inputLink, setInputLink] = useState("www.");

  useEffect(() => {
    // Retrieve the saved link from localStorage
    const savedLink = defaultValue;
    if (savedLink) {
      setInputLink(savedLink);
    }
  }, [defaultValue]);

  const handleInputChange = (e) => {
    const newLink = e.target.value;
    setInputLink(newLink);
    localStorage.setItem('savedLink', newLink);
  };
  return (
    <FormControl sx={{ m: 1, width: '75%', bgcolor: 'transparent' }} {...rest}>
      <TextField
        value={inputLink}
        placeholder="Enter your website link here..."
        // autoFocus
        disabled={isDisabled || false}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                sx={{
                  display: 'flex',
                  padding: '8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '18px',
                  borderRadius: '10px',
 background: `var(--brand-mix, conic-gradient(
      from 180deg at 50% 50%,
      #0047ab 4.67deg,     /* Dark Blue */
      #005bb5 23.65deg,    /* Slightly Lighter Blue */
      #0073e6 44.85deg,    /* Bright Blue */
      #0099ff 72.46deg,    /* Sky Blue */
      #00bfff 82.50deg,    /* Light Sky Blue */
      #00e5ff 127.99deg,   /* Light Cyan */
      #00ffff 160.97deg,   /* Cyan */
      #1affff 178.46deg,   /* Very Light Cyan */
      #33ccff 189.48deg,   /* Light Blue */
      #3399ff 202.95deg,   /* Strong Blue */
      #3366ff 230.66deg,   /* Rich Blue */
      #3333ff 251.35deg,   /* Deep Blue */
      #2929ff 276.44deg,   /* Deeper Blue */
      #1f1fff 306.45deg,   /* Deeper Blue */
      #1a1aff 331.68deg    /* Deepest Blue */
    )
  )`,                }}
              >
                <FaMagic style={{ color: 'black' }}/>
              </Box>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 0.6,
            background: 'rgba(43, 36, 60, 0.90)',
            boxShadow: '0px 0px 60px 0px rgba(13, 200, 192, 0.25)',
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: 'rgba(255, 208, 242, 0.60)',
            },
          },
        }}
      />
    </FormControl>
  );
}

export default LinkInput;
