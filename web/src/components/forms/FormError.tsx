import Typography from "@mui/material/Typography";

export const FormError = ({ text }: { text?: string }) => (
  <Typography component="span" color="error" variant="caption">
    {text}
  </Typography>
);
