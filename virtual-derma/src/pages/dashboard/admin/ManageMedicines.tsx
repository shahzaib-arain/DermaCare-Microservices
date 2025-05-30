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
  Button,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { MedicineDTO } from '../../../types/pharmacyTypes';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../contexts/AuthContext';

export const ManageMedicines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<MedicineDTO[]>([]);

  const fetchMedicines = async () => {
    try {
      const response = await apiClient.get<MedicineDTO[]>('/api/pharmacy/medicines', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setMedicines(response.data);
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await apiClient.delete(`/api/pharmacy/medicines/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchMedicines();
    } catch (error) {
      console.error('Failed to delete medicine:', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchMedicines();
    }
  }, [user]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Medicines
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View and manage the pharmacy inventory
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/medicines/add')}
        >
          Add Medicine
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.description}</TableCell>
                <TableCell>{medicine.manufacturer}</TableCell>
                <TableCell>${medicine.price?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{medicine.stock || 'N/A'}</TableCell>
                <TableCell>{medicine.category || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/admin/medicines/edit/${medicine.id}`)}
                    size="large"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(medicine.id)} size="large">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
