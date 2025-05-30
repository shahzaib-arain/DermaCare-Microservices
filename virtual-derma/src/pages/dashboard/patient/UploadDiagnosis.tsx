import { Box, Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { diagnosisSchema } from '../../../utils/validationSchemas';
import { ImageUploader } from '../../../components/ui/ImageUploader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

interface FormData {
  notes: string;
}

export const UploadDiagnosis = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(diagnosisSchema)
  });

  const onSubmit = async (data: FormData) => {
    if (!file) {
      alert('Please upload an image file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('notes', data.notes);

      await apiClient.post('/diagnosis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/patient/diagnosis');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Upload Diagnosis</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Submit images of your skin condition for expert evaluation
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600 }}>
        <Box sx={{ mb: 3 }}>
          <ImageUploader onImageUpload={(file) => setFile(file)} />
        </Box>

        <TextField
          label="Additional Notes"
          multiline
          rows={4}
          fullWidth
          {...register('notes')}
          error={!!errors.notes}
          helperText={errors.notes?.message}
          sx={{ mb: 3 }}
        />

        <Button type="submit" variant="contained" size="large">
          Submit for Diagnosis
        </Button>
      </Box>
    </Box>
  );
};
