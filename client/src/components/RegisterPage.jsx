import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';  
import './RegisterPage.css';
import backgroundImage from '../assets/images/registration.jpg'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const RegisterPage = () => {
  const navigate = useNavigate(); 
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const initialValues = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/\d/, 'Password must contain at least one digit')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:5555/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Registration successful', result);
        navigate('/home'); 
      } else {
        const error = await response.json();
        console.log('Registration failed', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="registration-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="registration-container">
        <h1>Join Us Today</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form className="registration-form">
              <div className="form-control">
                <label htmlFor="name">Name:</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>

              <div className="form-control">
                <label htmlFor="username">Username:</label>
                <Field type="text" id="username" name="username" />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              <div className="form-control">
                <label htmlFor="email">Email:</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="form-control">
                <label htmlFor="password">Password:</label>
                <div className="password-container">
                  <Field
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="form-control">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <div className="password-container">
                  <Field
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  >
                    {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </div>

              <button type="submit">Continue To Homepage</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;
