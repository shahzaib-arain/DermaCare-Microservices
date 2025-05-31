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
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { MedicineDTO } from '../../../types/pharmacyTypes';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../contexts/AuthContext';
import { addMedicine } from '../../../api/pharmacyService'; // Make sure this import exists

export const ManageMedicines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<MedicineDTO[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    description: '',
    manufacturer: '',
    price: 0,
    stock: 0,
    category: '',
    dosageForm: '',
  });

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

  const handleAddMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMedicine(newMedicine);
      setShowAddForm(false);
      setNewMedicine({
        name: '',
        description: '',
        manufacturer: '',
        price: 0,
        stock: 0,
        category: '',
        dosageForm: '',
      });
      fetchMedicines();
    } catch (error) {
      console.error('Failed to add medicine:', error);
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
          onClick={() => setShowAddForm(true)}
        >
          Add Medicine
        </Button>
      </Box>

      {showAddForm && (
        <Box
          component="form"
          sx={{
            mb: 4,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
          onSubmit={handleAddMedicineSubmit}
        >
          <Typography variant="h6" gutterBottom>
            Add New Medicine
          </Typography>
          <TextField
            label="Name"
            value={newMedicine.name}
            onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={newMedicine.description}
            onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Manufacturer"
            value={newMedicine.manufacturer}
            onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Price"
            type="number"
            value={newMedicine.price}
            onChange={(e) => setNewMedicine({ ...newMedicine, price: Number(e.target.value) })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Stock"
            type="number"
            value={newMedicine.stock}
            onChange={(e) => setNewMedicine({ ...newMedicine, stock: Number(e.target.value) })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Category"
            value={newMedicine.category}
            onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Dosage Form"
            value={newMedicine.dosageForm}
            onChange={(e) => setNewMedicine({ ...newMedicine, dosageForm: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

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
