import { Button as MuiButton, ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <MuiButton
      ref={ref}
      variant="contained"
      color="primary"
      {...props}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        px: 4,
        py: 1.5,
        ...props.sx,
      }}
    />
  );
});