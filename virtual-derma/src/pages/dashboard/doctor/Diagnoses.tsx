import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { useEffect } from 'react';
import { DiagnosisDTO } from '../../../types/diagnosisTypes';
import { formatDate } from '../../../utils/dateUtils';

export const Diagnoses = () => {
  const { data: diagnoses, fetchData: fetchDiagnoses } = useApi<DiagnosisDTO[]>();

  useEffect(() => {
    fetchDiagnoses({
      url: '/api/diagnosis',
      method: 'get'
    });
  }, [fetchDiagnoses]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patient Diagnoses
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Review and analyze patient-submitted skin conditions
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diagnoses?.filter(d => d.status === 'PENDING').map((diagnosis) => (
              <TableRow key={diagnosis.id}>
                <TableCell>{diagnosis.patientName}</TableCell>
                <TableCell>{formatDate(diagnosis.createdAt)}</TableCell>
                <TableCell>
                  <Box sx={{
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: 'warning.light',
                    color: 'common.white'
                  }}>
                    {diagnosis.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    size="small"
                    href={`/doctor/diagnosis/${diagnosis.id}`}
                  >
                    Analyze
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};