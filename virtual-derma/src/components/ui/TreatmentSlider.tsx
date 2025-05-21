import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const treatments = [
  {
    id: 1,
    name: 'Acne Treatment',
    image: '/images/treatments/acne.jpg',
    description: 'Virtual consultation for acne and skin blemishes'
  },
  {
    id: 2,
    name: 'Eczema Care',
    image: '/images/treatments/eczema.jpg',
    description: 'Personalized treatment plans for eczema'
  },
  {
    id: 3,
    name: 'Psoriasis Management',
    image: '/images/treatments/psoriasis.jpg',
    description: 'Expert care for psoriasis symptoms'
  },
  {
    id: 4,
    name: 'Skin Cancer Screening',
    image: '/images/treatments/screening.jpg',
    description: 'Early detection through virtual assessment'
  }
];

export const TreatmentSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Our Treatments
      </Typography>
      <Slider {...settings}>
        {treatments.map((treatment) => (
          <Box key={treatment.id} sx={{ px: 1 }}>
            <Box sx={{
              height: 300,
              backgroundImage: `url(${treatment.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              position: 'relative'
            }}>
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                p: 2,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8
              }}>
                <Typography variant="h6">{treatment.name}</Typography>
                <Typography variant="body2">{treatment.description}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};