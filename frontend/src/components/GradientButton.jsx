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
      #0033cc 4.67deg,     /* Original Pink - Darker Pink */
      #0033cc 23.65deg,    /* Original Pink - Slightly Lighter Pink */
      #8c2ebe 44.85deg,    /* Original Purple */
      #792fbf 72.46deg,    /* Original Purple */
      #6c30c0 82.50deg,    /* Original Purple */
      #4b32c3 127.99deg,   /* Original Purple */
      #0033cc 160.97deg,   /* Original Purple */
      #0033cc 178.46deg,   /* Original Purple */
      #0033cc 189.48deg,   /* Original Purple */
      #0033cc 202.95deg,   /* Original Pink - Replaced with Dark Blue */
      #0033cc 230.66deg,   /* Dark Blue */
      #0022a8 251.35deg,   /* Darker Blue */
      #001a80 276.44deg,   /* Darker Blue */
      #001266 306.45deg,   /* Darkest Blue */
      #0033cc 331.68deg    /* Darkest Blue */
    )
  )`,
        boxShadow: '0px 0px 20px 0px rgba(236, 39, 182)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.75rem 2rem',
        '&:hover': {
          boxShadow: '0px 0px 25px 0px rgba(236, 39, 182)',
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
