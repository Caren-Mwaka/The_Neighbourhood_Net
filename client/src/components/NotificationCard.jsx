import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid } from '@mui/material';

const NotificationCard = ({ title, message, date, onDismiss }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ maxWidth: 345, backgroundColor: '#f9f9f9', margin: '1rem auto' }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ marginTop: '0.5rem' }}>
            {new Date(date).toLocaleDateString()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={onDismiss}>
            Dismiss
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default NotificationCard;