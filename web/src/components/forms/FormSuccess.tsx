import Typography from "@mui/material/Typography";

export const FormSuccess = ({ text }: { text?: string }) => (
  <Typography component="span" color="green" variant="subtitle2">
    {text}
  </Typography>
);
