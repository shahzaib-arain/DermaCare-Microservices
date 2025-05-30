import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { DiagnosisDTO } from '../../../types/diagnosisTypes';
import { formatDateTime } from '../../../utils/dateUtils';
import apiClient from '../../../api/apiClient';

export const Diagnoses = () => {
  const { user } = useAuth();
  const [diagnoses, setDiagnoses] = useState<DiagnosisDTO[]>([]);

  useEffect(() => {
    if (user?.id && user.token) {
      apiClient
        .get<DiagnosisDTO[]>(`/api/diagnosis/doctor/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setDiagnoses(res.data))
        .catch((err) => console.error('Failed to fetch diagnoses:', err));
    }
  }, [user]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Diagnoses
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View all diagnoses you have recorded
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Date & Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diagnoses.map((diagnosis) => (
              <TableRow key={diagnosis.id}>
                <TableCell>{diagnosis.patientName}</TableCell>
                <TableCell>{diagnosis.diagnosis}</TableCell>
                <TableCell>{diagnosis.notes}</TableCell>
                <TableCell>{formatDateTime(diagnosis.diagnosedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
