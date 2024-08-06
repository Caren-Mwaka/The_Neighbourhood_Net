import React from 'react';
import logo from '../assets/Green and Black Minimalist Education Logo (1).png'; 
import TelegramIcon from '@mui/icons-material/Telegram';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './ContactSection.css';

const validationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  message: yup.string().required('Message is required'),
});

const ContactSection = () => {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <section className="section">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="content">
          <Typography variant="h2" component="h2">Let's talk</Typography>
          <Typography variant="body1">Ask us anything or just say hi...</Typography>
          <div className="contact">
            <div className="phone">
              <PhoneIcon style={{ color: '#fff', marginRight: 10 }} />
              <Typography variant="body2">0712 345 678</Typography>
            </div>
            <div className="email">
              <EmailIcon style={{ color: '#fff', marginRight: 10 }} />
              <Typography variant="body2">heyneighbour@gmail.com</Typography>
            </div>
          </div>
        </div>
        <div className="form-container">
          <form className="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="fullName"
              name="fullName"
              label="Full name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              margin="normal"
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            <TextField
              fullWidth
              id="message"
              name="message"
              label="Message"
              value={formik.values.message}
              onChange={formik.handleChange}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
              multiline
              rows={6}
              margin="normal"
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            <Button variant="contained" fullWidth type="submit" className="btn">
              Send Message <ArrowForwardIcon />
            </Button>
          </form>
        </div>
        <div className="telegram-icon">
          <TelegramIcon style={{ fontSize: 70 }} />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;