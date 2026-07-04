import React, { useContext, useState } from 'react';
import { useFormik } from 'formik'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { userContext } from "../../Context/userContext";
import { Helmet } from 'react-helmet';
import '../../styles/Auth.css';

export default function Register() {
  let [message, setMessage] = useState('');
  let [loading, setLoading] = useState(false);
  let [role, setRole] = useState('user'); 
  let [step, setStep] = useState(1); 
  let [savedToken, setSavedToken] = useState(null); 
  let { setSellerOrUser, setSignupMessage } = useContext(userContext); 
  let navigate = useNavigate();

  const accountForm = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: ""
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required').min(3, 'Minimum length is 3 characters').max(30, 'Maximum length is 30 characters'),
      email: Yup.string().required('Email is required').email('Enter a valid email address'),
      phoneNumber: Yup.string().required('Phone number is required').matches(/^01[1250][0-9]{8}$/, 'Enter a valid Egyptian phone number'),
      password: Yup.string().required('Password is required').matches(/^[A-Z][a-z0-9]{6,8}$/, 'Must start with Uppercase followed by 6-8 alpha-numeric characters'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage('');
      
      axios.post('https://egzone.runasp.net/api/Auth/register', values)
        .then((response) => {
          if (response?.status === 200 || response?.status === 201 || response?.data?.message === 'Account Created Successfully') {
            
            if (role === 'user') {
              if (setSignupMessage) setSignupMessage('Account Created Successfully!');
              setLoading(false);
              navigate('/login');
            } else {
              axios.post('https://egzone.runasp.net/api/Auth/login', {
                email: values.email,
                password: values.password
              })
              .then((loginRes) => {
                if (loginRes.data.token) {
                  setSavedToken(loginRes.data.token);
                  setStep(2); 
                  setLoading(false);
                }
              })
              .catch(() => {
                setLoading(false);
                setMessage('Account created, please login manually to setup your store.');
              });
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          setMessage(error?.response?.data?.message || error?.response?.data || 'Registration failed.');
        });
    }
  });

  const sellerForm = useFormik({
    initialValues: {
      storeName: "",
      description: "",
      contactNumber: ""
    },
    validationSchema: Yup.object({
      storeName: Yup.string().required('Store name is required').min(3, 'Too short'),
      description: Yup.string().required('Description is required').min(10, 'Please write a descriptive profile summary'),
      contactNumber: Yup.string().required('Contact number is required').matches(/^01[1250][0-9]{8}$/, 'Invalid phone number')
    }),
    onSubmit: (values) => {
      setLoading(true);
      setMessage('');

      axios.post('https://egzone.runasp.net/api/Sellers/register-as-seller', values, {
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Accept': 'text/plain',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        setLoading(false);
        console.log('Seller ID: ', response?.data?.sellerId);
        localStorage.setItem("sellerId", response?.data?.sellerId);
        
        if (setSignupMessage) {
          setSignupMessage('Merchant account created successfully! Please sign in to access your dashboard.');
        }
        navigate('/login');
      })
      .catch((error) => {
        setLoading(false);
        setMessage(typeof error?.response?.data === 'string' ? error?.response?.data : 'Store registration failed. Please try again.');
      });
    }
  });

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('role', selectedRole); 
    if (setSellerOrUser) setSellerOrUser(selectedRole); 
  };

  return (
    <>
      <Helmet>
        <title>{role === 'seller' ? 'Seller Hub Registration | EGZone' : 'Create Account | EGZone'}</title>
      </Helmet>
      
      <div className="auth-page-wrapper">
        <div className="auth-glass-card shadow-lg">
          <div className="card-body p-4 p-sm-5">
            
            {/* Header Identity Block Area Layout */}
            <div className="text-center mb-4">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <i className="fa-solid fa-bolt text-warning fs-3 auth-brand-accent"></i>
                <h1 className="auth-brand-title m-0">EG<span className="auth-brand-accent">ZONE</span></h1>
              </div>
              <p className="auth-subtitle">
                {step === 1 ? 'Fill in your personal credentials below' : 'Set up your online store details'}
              </p>
              {message ? (
                <div className="auth-alert-error alert mt-3 text-start d-flex align-items-center gap-2" role="alert">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{message}</span>
                </div>
              ) : null}
            </div>

            {/* Seamless Switcher Selection Tab Row Controls */}
            {step === 1 && (
              <div className="auth-role-tabs">
                <button
                  type="button"
                  className={`auth-tab-trigger ${role === 'user' ? 'active-user' : 'inactive'}`}
                  onClick={() => handleRoleChange('user')}
                >
                  <i className="fa-solid fa-user-tag me-1"></i> Customer
                </button>
                <button
                  type="button"
                  className={`auth-tab-trigger ${role === 'seller' ? 'active-seller' : 'inactive'}`}
                  onClick={() => handleRoleChange('seller')}
                >
                  <i className="fa-solid fa-shop me-1"></i> Seller / Factory
                </button>
              </div>
            )}

            {/* Step 1 Profile Fields Architecture */}
            {step === 1 && (
              <form onSubmit={accountForm.handleSubmit}>
                <div className="mb-3">
                  <label className="auth-input-label">Full Name</label>
                  <div className="auth-input-group">
                    <input value={accountForm.values.fullName} name='fullName' type="text" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control auth-field-control" placeholder="John Doe" required />
                    <i className="fa-solid fa-user auth-input-icon"></i>
                  </div>
                  {accountForm.touched.fullName && accountForm.errors.fullName ? <div className="auth-inline-error"><i className="fa-solid fa-circle-xmark"></i> {accountForm.errors.fullName}</div> : null}
                </div>
                
                <div className="mb-3">
                  <label className="auth-input-label">Email Address</label>
                  <div className="auth-input-group">
                    <input value={accountForm.values.email} name='email' type="email" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control auth-field-control" placeholder="name@example.com" required />
                    <i className="fa-solid fa-envelope auth-input-icon"></i>
                  </div>
                  {accountForm.touched.email && accountForm.errors.email ? <div className="auth-inline-error"><i className="fa-solid fa-circle-xmark"></i> {accountForm.errors.email}</div> : null}
                </div>

                <div className="mb-3">
                  <label className="auth-input-label">Password</label>
                  <div className="auth-input-group">
                    <input value={accountForm.values.password} name='password' type="password" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control auth-field-control" placeholder="••••••••" required />
                    <i className="fa-solid fa-lock auth-input-icon"></i>
                  </div>
                  {accountForm.touched.password && accountForm.errors.password ? <div className="auth-inline-error"><i className="fa-solid fa-circle-xmark"></i> {accountForm.errors.password}</div> : null}
                </div>

                <div className="mb-4">
                  <label className="auth-input-label">Phone Number</label>
                  <div className="auth-input-group">
                    <input value={accountForm.values.phoneNumber} name='phoneNumber' type="tel" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control auth-field-control" placeholder="01XXXXXXXXX" required />
                    <i className="fa-solid fa-phone auth-input-icon"></i>
                  </div>
                  {accountForm.touched.phoneNumber && accountForm.errors.phoneNumber ? <div className="auth-inline-error"><i className="fa-solid fa-circle-xmark"></i> {accountForm.errors.phoneNumber}</div> : null}
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className={`btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2 ${role === 'seller' ? 'auth-submit-btn-gold' : 'auth-submit-btn-purple'}`} disabled={!(accountForm.isValid && accountForm.dirty) || loading}>
                    {loading ? <i className='fa fa-spinner fa-spin'></i> : (role === 'seller' ? <>Next: Store Details <i className="fa-solid fa-arrow-right fs-6"></i></> : <>Sign Up <i className="fa-solid fa-user-plus fs-6"></i></>)}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 Business/Factory Registration Info Blocks */}
            {step === 2 && (
              <form onSubmit={sellerForm.handleSubmit} className="mt-2">
                <div className="auth-alert-success alert text-center d-flex align-items-center justify-content-center gap-2 mb-4" role="alert">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Personal account verified. Complete store setup.</span>
                </div>
                
                <div className="mb-3">
                  <label className="auth-input-label">Store Name (اسم المحل أو المصنع)</label>
                  <div className="auth-input-group">
                    <input value={sellerForm.values.storeName} name='storeName' type="text" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control auth-field-control" placeholder="e.g. Al Bazar Factory" required />
                    <i className="fa-solid fa-store auth-input-icon"></i>
                  </div>
                  {sellerForm.touched.storeName && sellerForm.errors.storeName ? <div className="auth-inline-error"><i className="fa-solid fa-circle-xmark"></i> {sellerForm.errors.storeName}</div> : null}
                </div>

                <div className="mb-3">
                  <label className="auth-input-label">Store Description (وصف المنتجات والنشاط)</label>
                  <div className="position-relative">
                    <textarea value={sellerForm.values.description} name='description' rows="3" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control auth-field-control ps-3" placeholder="Describe your product catalog, specialties..." required></textarea>
                  </div>
                  {sellerForm.touched.description && sellerForm.errors.description ? <div className="auth-inline-error"><i className="fa-solid fa-circle-xmark"></i> {sellerForm.errors.description}</div> : null}
                </div>

                <div className="mb-4">
                  <label className="auth-input-label">Store Contact Number (رقم التواصل التجاري)</label>
                  <div className="auth-input-group">
                    <input value={sellerForm.values.contactNumber} name='contactNumber' type="tel" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control auth-field-control" placeholder="e.g. 010XXXXXXXX" required />
                    <i className="fa-solid fa-address-book auth-input-icon"></i>
                  </div>
                  {sellerForm.touched.contactNumber && sellerForm.errors.contactNumber ? <div className="auth-inline-error"><i className="fa-solid fa-circle-xmark"></i> {sellerForm.errors.contactNumber}</div> : null}
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2 auth-submit-btn-gold" disabled={!(sellerForm.isValid && sellerForm.dirty) || loading}>
                    {loading ? <i className='fa fa-spinner fa-spin'></i> : <>Launch Store & Finish <i className="fa-solid fa-rocket fs-6"></i></>}
                  </button>
                </div>
              </form>
            )}

            {step === 1 && (
              <p className="text-center auth-subtitle mt-4 mb-0">
                Already have an account?{' '}
                <Link to="/login" className="auth-footer-link text-decoration-none">Sign In</Link>
              </p>
            )}

          </div>
        </div>
      </div>
    </>
  );
}