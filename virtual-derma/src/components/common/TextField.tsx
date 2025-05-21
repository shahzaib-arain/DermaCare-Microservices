import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  return (
    <MuiTextField
      ref={ref}
      variant="outlined"
      fullWidth
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'divider',
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: 1,
          },
        },
        ...props.sx,
      }}
    />
  );
});