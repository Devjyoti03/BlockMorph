import { Box, Button } from "@mui/material";

function LightButton({ text, icon, ...rest }) {
  return (
    <Button
      startIcon={
        (
          <Box
            sx={{
              borderRadius: "8px",
              background: `var(--brand-mix, conic-gradient(
      from 180deg at 50% 50%,
      #0047ab 4.67deg,     /* Dark Blue */
      #005bb5 23.65deg,    /* Slightly Lighter Blue */
      #0073e6 44.85deg,    /* Bright Blue */
      #2929ff 72.46deg,    /* Sky Blue */
      #2929ff 82.50deg,    /* Light Sky Blue */
      #2929ff 127.99deg,   /* Light Cyan */
      #2929ff 160.97deg,   /* Cyan */
      #1affff 178.46deg,   /* Very Light Cyan */
      #33ccff 189.48deg,   /* Light Blue */
      #3399ff 202.95deg,   /* Strong Blue */
      #3366ff 230.66deg,   /* Rich Blue */
      #3333ff 251.35deg,   /* Deep Blue */
      #2929ff 276.44deg,   /* Deeper Blue */
      #1f1fff 306.45deg,   /* Deeper Blue */
      #1a1aff 331.68deg    /* Deepest Blue */
    ))`,
              px: 1,
            }}
          >
            <div style={{ color: 'black' }}>
              {icon}
            </div>
          </Box>
        ) || null
      }
      disableElevation
      sx={{
        borderRadius: 1,
        border: "2px solid #2E3C51",
        background: 'rgb(39, 51, 89, 0.4)',
        boxShadow: "0px 0px 13px 0px darkblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      variant="contained"
      {...rest}
    >
      {text && text}
    </Button>
  );
}

export default LightButton;
