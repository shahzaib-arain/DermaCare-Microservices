import { Card, CardContent, Typography, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: SvgIconComponent;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  trend?: 'up' | 'down';
  trendValue?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary', 
  trend, 
  trendValue 
}: StatsCardProps) => {
  return (
   <Card sx={{ 
  minWidth: 275, 
  height: '100%',
  width: '100%', // Add this
  maxWidth: '100%' // Add this
}}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Icon color={color} fontSize="large" />
        </Box>
        <Typography variant="h3" sx={{ mt: 1, mb: 1.5 }}>
          {value}
        </Typography>
        {trend && trendValue && (
          <Typography 
            variant="body2" 
            color={trend === 'up' ? 'success.main' : 'error.main'}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue} from last month
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};