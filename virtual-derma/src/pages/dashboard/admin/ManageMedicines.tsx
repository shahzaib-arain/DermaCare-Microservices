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
  IconButton
} from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { useEffect } from 'react';
import { MedicineDTO } from '../../../types/pharmacyTypes';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export const ManageMedicines = () => {
  const { data: medicines, fetchData: fetchMedicines } = useApi<MedicineDTO[]>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines({
      url: '/api/pharmacy/medicines',
      method: 'get'
    });
  }, [fetchMedicines]);

  const handleDeleteClick = async (medicineId: string | number) => {
    try {
      await fetchMedicines({
        url: `/api/pharmacy/medicines/${medicineId}`,
        method: 'delete'
      });
      // Refresh medicines list after deletion
      fetchMedicines({
        url: '/api/pharmacy/medicines',
        method: 'get'
      });
    } catch (error) {
      console.error('Failed to delete medicine:', error);
    }
  };

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
            {medicines?.map((medicine) => (
              <TableRow key={medicine.medicineId}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.description}</TableCell>
                <TableCell>{medicine.manufacturer}</TableCell>
                <TableCell>${medicine.price.toFixed(2)}</TableCell>
                <TableCell>{medicine.stock}</TableCell>
                <TableCell>{medicine.category}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => navigate(`/admin/medicines/edit/${medicine.medicineId}`)}
                  >
                    <EditIcon />
                  </IconButton>
              <IconButton onClick={() => handleDeleteClick(medicine.medicineId.toString())}>
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
