import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { diagnosisSchema } from '../../../utils/validationSchemas';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Added useEffect
import { uploadImage } from '../../../api/diagnosisService';

type FormValues = {
  file: File;
  notes: string;
};

export const UploadDiagnosis = () => {
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // Added for image preview
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(diagnosisSchema),
    defaultValues: {
      file: undefined,
      notes: ''
    }
  });

  const selectedFile = watch('file');

  // Create preview URL when file changes
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Clean up on unmount
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setError(null);
      
      if (!isAuthenticated || !user) {
        throw new Error('Please login to submit a diagnosis request');
      }

      await uploadImage(data.file, data.notes);
      navigate('/patient/upload-diagnosis', { state: { success: true } });
    } catch (error) {
      console.error('Submission failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit diagnosis request');
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Please login to submit a diagnosis request
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Skin Diagnosis Request
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload an image of your skin condition for analysis by our specialists
      </Typography>

      {error && (
        <Box sx={{ color: 'error.main', mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: 600,
          '& .MuiTextField-root': { mb: 2 }
        }}
      >
        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <Box>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2, py: 2 }}
              >
                {selectedFile ? 'Image selected' : 'Upload Image'} {/* Changed display text */}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      field.onChange(e.target.files[0]);
                    }
                  }}
                />
              </Button>
              {preview && (
                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  justifyContent: 'center',
                  border: '1px dashed #ccc',
                  p: 1,
                  borderRadius: 1
                }}>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px',
                      objectFit: 'contain'
                    }} 
                  />
                </Box>
              )}
            </Box>
          )}
        />
        {errors.file && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errors.file.message}
          </Typography>
        )}

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Additional Notes"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              error={!!errors.notes}
              helperText={errors.notes?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          disabled={isSubmitting || !selectedFile}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Submit for Diagnosis'}
        </Button>
      </Box>
    </Box>
  );
};