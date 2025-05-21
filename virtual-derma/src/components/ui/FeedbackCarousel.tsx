import { Box, Typography, Avatar } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Patient',
    text: 'The virtual consultation was so convenient and the doctor was extremely knowledgeable.',
    avatar: '/images/avatars/1.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Patient',
    text: 'I got my skin condition diagnosed and treated without leaving my home. Amazing service!',
    avatar: '/images/avatars/2.jpg'
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Patient',
    text: 'The dermatologist was very thorough and my prescription arrived the same day.',
    avatar: '/images/avatars/3.jpg'
  }
];

export const FeedbackCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f5f5f5', 
      p: 4,
      borderRadius: 2,
      my: 4
    }}>
      <Typography variant="h4" align="center" gutterBottom>
        Patient Testimonials
      </Typography>
      <Slider {...settings}>
        {testimonials.map((testimonial) => (
          <Box key={testimonial.id} sx={{ px: 4, textAlign: 'center' }}>
            <Avatar
              src={testimonial.avatar}
              sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto',
                mb: 2
              }}
            />
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
              "{testimonial.text}"
            </Typography>
            <Typography variant="h6">
              {testimonial.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {testimonial.role}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};