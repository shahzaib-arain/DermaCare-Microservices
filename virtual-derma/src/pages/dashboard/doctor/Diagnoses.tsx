import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { useEffect } from 'react';
import { DiagnosisDTO } from '../../../types/diagnosisTypes';
import { formatDate } from '../../../utils/dateUtils';
import { useAuth } from '../../../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

export const Diagnoses = () => {
  const { user } = useAuth();
  const { data: diagnoses, fetchData: fetchDiagnoses, loading, error } = useApi<DiagnosisDTO[]>();

  useEffect(() => {
    if (user?.token) {
      fetchDiagnoses({
        url: '/api/diagnosis',
        method: 'get',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    }
  }, [fetchDiagnoses, user?.token]);

  if (loading) return <Typography>Loading diagnoses...</Typography>;
  if (error) return <Typography color="error">Failed to load diagnoses.</Typography>;
  if (!diagnoses || diagnoses.length === 0) return <Typography>No diagnoses found.</Typography>;

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
            {diagnoses.filter(d => d.status === 'PENDING').map((diagnosis) => (
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
                    component={RouterLink}
                    to={`/doctor/diagnosis/${diagnosis.id}`}
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
