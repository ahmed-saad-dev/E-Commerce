import React, { useContext, useState } from 'react';
import { useFormik } from 'formik'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { userContext } from '../../Context/userContext';
import { Helmet } from 'react-helmet';
import '../../styles/Auth.css';
import styles from './Login.module.css';
export default function Login() {
  let [message, setMessage] = useState('');
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  let { isSellerOrUser, setSellerEmail, setSellerOrUser } = useContext(userContext);
  let permission = useContext(userContext);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  async function formMaipulation(formData) {
    setLoading(true);
    setMessage(''); 

    const adminEmail = "AS@gmail.com";
  const adminPassword = "123456";

    if (formData.email.trim() === adminEmail && formData.password === adminPassword) {
      axios.post('https://egzone.runasp.net/api/Auth/login', formData)
        .then((response) => {
          if (response.data.token) {
            permission.setLogin(response?.data?.token);
            localStorage.setItem('userToken', response?.data?.token);
            localStorage.setItem('role', 'admin');
            if (setSellerOrUser) setSellerOrUser('admin'); 

            setLoading(false);
            navigate('/admin'); 
          }
        })
        .catch((error) => {
          setLoading(false);
          setMessage(error?.response?.data || "خطأ في تسجيل دخول المسؤول");
        });
      return; 
    }

    axios.post('https://egzone.runasp.net/api/Auth/login', formData)
      .then((response) => { 
        console.log('API Response data: ', response.data);
        setSellerEmail(formData?.email);
        let the_Role = localStorage.getItem('role');
        if (response.data.token) {
          permission.setLogin(response?.data?.token);
          localStorage.setItem('userToken', response?.data?.token);

          if (the_Role === 'seller') {
            if (setSellerOrUser) setSellerOrUser('seller'); 
            setLoading(false); 
            navigate('/Seller');
          } else if (the_Role === 'user') {
            if (setSellerOrUser) setSellerOrUser('user');
            setLoading(false); 
            navigate('/');
          } else {
            setLoading(false); 
            navigate('/');
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        setMessage(error?.response?.data || "Invalid email or password");
      });
  }

  let formObject = useFormik({ 
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required').email('Enter a valid email address'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: formMaipulation,
  });

  return (
    <>
      <Helmet>
        <title>Login | EGZone</title>
      </Helmet>
      
      <div className="auth-page-wrapper">
        <div className="auth-glass-card shadow-lg">
          <div className="card-body p-4 p-sm-5">
            
            {/* Back Button */}
            <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className={styles.backButton}
          >
            <span>←</span>
            العودة
          </button>
            </div>

            {/* Header Brand Block area layout */}
            <div className="text-center mb-4">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <i className="fa-solid fa-bolt text-warning fs-3 auth-brand-accent"></i>
                <h1 className="auth-brand-title m-0">EG<span className="auth-brand-accent">ZONE</span></h1>
              </div>
              <p className="auth-subtitle">Welcome back! Please sign in to access your profile</p>
              {message ? (
                <div className="auth-alert-error alert mt-3 text-start d-flex align-items-center gap-2" role="alert">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{message}</span>
                </div>
              ) : null}
            </div>

            {/* Interactive Forms Control Container */}
            <form onSubmit={formObject.handleSubmit} className="mt-2">
              
              <div className="mb-3">
                <label htmlFor="email" className="auth-input-label">Email Address</label>
                <div className="auth-input-group">
                  <input 
                    value={formObject.values.email} 
                    name="email" 
                    type="email" 
                    onChange={formObject.handleChange} 
                    onBlur={formObject.handleBlur} 
                    className="form-control auth-field-control" 
                    id="email" 
                    placeholder="name@example.com" 
                    required 
                  />
                  <i className="fa-solid fa-envelope auth-input-icon"></i>
                </div>
                {formObject.touched.email && formObject.errors.email ? (
                  <div className="auth-inline-error">
                    <i className="fa-solid fa-circle-xmark"></i> {formObject.errors.email}
                  </div>
                ) : null}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="auth-input-label">Password</label>
                <div className="auth-input-group">
                  <input 
                    value={formObject.values.password} 
                    name="password" 
                    type="password" 
                    onChange={formObject.handleChange} 
                    onBlur={formObject.handleBlur} 
                    className="form-control auth-field-control" 
                    id="password" 
                    placeholder="••••••••" 
                    required 
                  />
                  <i className="fa-solid fa-lock auth-input-icon"></i>
                </div>
                {formObject.touched.password && formObject.errors.password ? (
                  <div className="auth-inline-error">
                    <i className="fa-solid fa-circle-xmark"></i> {formObject.errors.password}
                  </div>
                ) : null}
              </div>
              
              <div className="d-grid mt-4">
                <button 
                  type="submit" 
                  className={`btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2 ${isSellerOrUser === 'seller' ? 'auth-submit-btn-gold' : 'auth-submit-btn-purple'}`}
                  disabled={!(formObject.isValid && formObject.dirty) || loading}
                >
                  {loading ? (
                    <>
                      <i className="fa fa-spinner fa-spin"></i> Processing...
                    </>
                  ) : (
                    <>
                      Sign In <i className="fa-solid fa-arrow-right-to-bracket fs-6 ms-1"></i>
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-center auth-subtitle mt-4 mb-0">
                Don't have an account yet?{' '}
                <Link to="/register" className="auth-footer-link text-decoration-none">Sign up</Link>.
              </p>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}