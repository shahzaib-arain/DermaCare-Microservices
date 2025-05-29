import { Box, Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { diagnosisSchema } from '../../../utils/validationSchemas';
import { ImageUploader } from '../../../components/ui/ImageUploader';
import { useState } from 'react';
import { uploadImage } from '../../../api/diagnosisService';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormData {
  notes: string;
  // removed file here
}

export const UploadDiagnosis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(diagnosisSchema)
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.token || !file) {
      alert('Please upload an image file');
      return;
    }
    
    try {
      // Pass the JWT token here (user.token)
      await uploadImage(file, data.notes, user.token);
      navigate('/patient/diagnosis');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Diagnosis
      </Typography>
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
