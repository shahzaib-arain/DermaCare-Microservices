import { Box, Typography } from '@mui/material';

export const PatientDiagnosesPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Diagnoses
      </Typography>
      <Typography variant="body1">
        Your submitted diagnoses will appear here
      </Typography>
    </Box>
  );
};