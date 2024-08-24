import { Button } from '@mui/material';

function GradientButton({ icon, text, styles, isDisabled, ...rest }) {
  return (
    <Button
      startIcon={icon || null}
      disableElevation
      disabled={isDisabled}
      sx={{
        borderRadius: 6,
   background: `var(--brand-mix, conic-gradient(
    from 180deg at 50% 50%,
    #0033cc 4.67deg,    /* Original Pink - Darker Pink */
    #0033cc 23.65deg,   /* Original Pink - Slightly Lighter Pink */
    #000000 44.85deg,   /* Changed to Black */
    #000022 72.46deg,   /* Changed to Dark Blue */
    #000033 82.50deg,   /* Changed to Darker Blue */
    #002244 127.99deg,  /* Changed to Blue */
    #0033cc 160.97deg,  /* Dark Blue */
    #0033cc 178.46deg,  /* Dark Blue */
    #0033cc 189.48deg,  /* Dark Blue */
    #000000 202.95deg,  /* Changed to Black */
    #001a80 230.66deg,  /* Darker Blue */
    #0022a8 251.35deg,  /* Darker Blue */
    #001266 276.44deg,  /* Darkest Blue */
    #000000 306.45deg,  /* Changed to Black */
    #0033cc 331.68deg   /* Darkest Blue */
))`,
        boxShadow: '0px 0px 20px 0px cyan',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.75rem 2rem',
        '&:hover': {
          boxShadow: '0px 0px 25px 0px darkblue',
        },
        ...styles,
      }}
      variant="contained"
      {...rest}
    >
      <div>{text && text}</div>
    </Button>
  );
}

export default GradientButton;
