import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { useEffect, useState } from 'react';
import { MedicineDTO } from '../../../types/pharmacyTypes';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export const ManageMedicines = () => {
  const { data: medicines, fetchData: fetchMedicines } = useApi<MedicineDTO[]>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines({
      url: '/api/pharmacy/medicines',
      method: 'get'
    });
  }, [fetchMedicines]);

  const handleDeleteClick = (medicineId: string) => {
    setSelectedMedicine(medicineId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMedicine) {
      try {
        await fetchMedicines({
          url: `/api/pharmacy/medicines/${selectedMedicine}`,
          method: 'delete'
        });
        fetchMedicines({
          url: '/api/pharmacy/medicines',
          method: 'get'
        });
      } catch (error) {
        console.error('Failed to delete medicine:', error);
      }
    }
    setDeleteDialogOpen(false);
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
                  <IconButton 
                    color="error"
                    onClick={() => handleDeleteClick(medicine.medicineId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Medicine</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this medicine? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};