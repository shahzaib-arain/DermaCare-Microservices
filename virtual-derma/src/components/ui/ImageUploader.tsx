import { useState, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  label?: string;
  disabled?: boolean;
}

export const ImageUploader = ({ onImageUpload, label = "Upload Image", disabled = false }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <Box sx={{ 
      border: '1px dashed #ccc',
      borderRadius: 1,
      p: 2,
      textAlign: 'center',
      backgroundColor: preview ? 'transparent' : '#fafafa',
      position: 'relative',
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      ) : (
        <>
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {label}
          </Typography>
        </>
      )}
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <label htmlFor="image-upload">
        <Button
          variant="contained"
          component="span"
          disabled={disabled}
          sx={{ mt: 1 }}
        >
          Choose File
        </Button>
      </label>
    </Box>
  );
};