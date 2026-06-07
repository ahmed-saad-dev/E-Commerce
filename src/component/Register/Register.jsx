



// import React, { useContext, useState } from 'react';
// import { useFormik } from 'formik'; 
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import * as Yup from 'yup';
// import { userContext } from '../../Context/userContext';
// import { Helmet } from 'react-helmet';

// export default function Register() {
//   let [message, setMessage] = useState('');
//   let [loading, setLoading] = useState(false);
//   let [role, setRole] = useState('user'); // 'user' أو 'seller'
//   let [step, setStep] = useState(1); // Step 1: الحساب | Step 2: المتجر
//   let [savedToken, setSavedToken] = useState(null); 
//   let permission = useContext(userContext);
//   let navigate = useNavigate();

//   // 1️⃣ فورم بيانات الحساب الأساسية (يعمل بشكل دائم ومستقل)
//   const accountForm = useFormik({
//     initialValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       phoneNumber: ""
//     },
//     validationSchema: Yup.object({
//       fullName: Yup.string().required('Full name is required').min(3, 'min length is 3').max(30, 'max length is 30'),
//       email: Yup.string().required('Email is required').email('Enter valid email'),
//       phoneNumber: Yup.string().required('Phone number is required').matches(/^01[1250][0-9]{8}$/, 'Phone number not valid'),
//       password: Yup.string().required('Password is required').matches(/^[A-Z][a-z0-9]{6,8}$/, 'Not valid'),
//     }),
//     onSubmit: async (values) => {
//       setLoading(true);
//       setMessage('');
      
//       axios.post('https://egzone.runasp.net/api/Auth/register', values)
//         .then((response) => {
//           // التعامل مع النجاح سواء كان كود 200 أو 201 أو رسالة نجاح
//           if (response?.status === 200 || response?.status === 201 || response?.data?.message === 'Account Created Successfully') {
//             if (role === 'user') {
//               permission.setSignupMessage('Account Created Successfully!');
//               setLoading(false);
//               navigate('/login');
//             } else {
//               // لو بائع: تسجيل دخول تلقائي لأخذ توكن الصلاحية لإنشاء المتجر في الخطوة القادمة
//               axios.post('https://egzone.runasp.net/api/Auth/login', {
//                 email: values.email,
//                 password: values.password
//               })
//               .then((loginRes) => {
//                 if (loginRes.data.token) {
//                   setSavedToken(loginRes.data.token);
//                   setStep(2); // التوجه لبيانات المتجر (الخطوة الثانية)
//                   setLoading(false);
//                 }
//               })
//               .catch(() => {
//                 setLoading(false);
//                 setMessage('Account created, please login manually to setup your store.');
//               });
//             }
//           }
//         })
//         .catch((error) => {
//           setLoading(false);
//           setMessage(error?.response?.data?.message || error?.response?.data || 'Registration failed.');
//         });
//     }
//   });

//   // 2️⃣ فورم بيانات المتجر (يعمل بشكل دائم ومستقل ولا يستدعى إلا في الخطوة الثانية)
//   const sellerForm = useFormik({
//     initialValues: {
//       storeName: "",
//       description: "",
//       contactNumber: ""
//     },
//     validationSchema: Yup.object({
//       storeName: Yup.string().required('Store name is required').min(3, 'Too short'),
//       description: Yup.string().required('Description is required').min(10, 'Please write a good description'),
//       contactNumber: Yup.string().required('Contact number is required').matches(/^01[1250][0-9]{8}$/, 'Invalid phone number')
//     }),
//     onSubmit: (values) => {
//       setLoading(true);
//       setMessage('');

//       axios.post('https://egzone.runasp.net/api/Sellers/register-as-seller', values, {
//         headers: {
//           'Authorization': `Bearer ${savedToken}`,
//           'Accept': 'text/plain',
//           'Content-Type': 'application/json'
//         }
//       })
//       .then((response) => {
//         setLoading(false);
//         console.log('Seller ID: ', response?.data?.sellerId);
//         localStorage.setItem("sellerId", response?.data?.sellerId);
//         permission.setLogin(null); 
//         permission.setSignupMessage('Merchant account created successfully! Please sign in to access your dashboard.');
//         navigate('/login');
//       })
//       .catch((error) => {
//         setLoading(false);
//         setMessage(typeof error?.response?.data === 'string' ? error?.response?.data : 'Store registration failed. Please try again.');
//       });
//     }
//   });

//   return (
//     <>
//       <Helmet>
//         <title>{role === 'seller' ? 'Seller Registration' : 'Customer Registration'}</title>
//       </Helmet>
      
//       <div className="d-flex align-items-center justify-content-center mt-4 mb-4" style={{ minHeight: '70vh' }}>
//         <div className="card shadow-lg w-100 p-2" style={{ maxWidth: '550px', minHeight: '520px' }} >
//           <div className="card-body">
            
//             <div className="text-center">
//               <h1 className="card-title h3 fw-bold" style={{ color: '#198754' }}>
//                 {role === 'seller' ? 'Seller Hub Registration' : 'Create Account'}
//               </h1>
//               <p className="card-text text-muted">
//                 {step === 1 ? 'Fill in your personal credentials below' : 'Set up your online store details'}
//               </p>
//               {message ? <div className="alert alert-danger p-2 small text-start" style={{ wordBreak: 'break-word' }} role="alert">{message}</div> : null}
//             </div>

//             {step === 1 && (
//               <div className="d-flex bg-light p-1 rounded mb-4 mt-3" style={{ border: '1px solid #ddd' }}>
//                 <button
//                   type="button"
//                   className={`btn flex-fill py-2 fw-bold border-0 ${role === 'user' ? 'btn-success text-white' : 'btn-light text-muted'}`}
//                   onClick={() => localStorage.setItem('user')}
//                 >
//                   Customer
//                 </button>
//                 <button
//                   type="button"
//                   className={`btn flex-fill py-2 fw-bold border-0 ${role === 'seller' ? 'btn-success text-white' : 'btn-light text-muted'}`}
//                   onClick={() => localStorage.setItem('seller')}
//                 >
//                   Seller / Factory
//                 </button>
//               </div>
//             )}

//             {/* Step 1 Form */}
//             {step === 1 && (
//               <form onSubmit={accountForm.handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label text-muted small">Full Name</label>
//                   <input value={accountForm.values.fullName} name='fullName' type="text" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control" placeholder="Enter your name" required />
//                   {accountForm.touched.fullName && accountForm.errors.fullName ? <div className="text-danger small mt-1">{accountForm.errors.fullName}</div> : null}
//                 </div>
                
//                 <div className="mb-3">
//                   <label className="form-label text-muted small">Email Address</label>
//                   <input value={accountForm.values.email} name='email' type="email" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control" placeholder="Email Address" required />
//                   {accountForm.touched.email && accountForm.errors.email ? <div className="text-danger small mt-1">{accountForm.errors.email}</div> : null}
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label text-muted small">Password</label>
//                   <input value={accountForm.values.password} name='password' type="password" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control" placeholder="Password" required />
//                   {accountForm.touched.password && accountForm.errors.password ? <div className="text-danger small mt-1">{accountForm.errors.password}</div> : null}
//                 </div>

//                 <div className="mb-4">
//                   <label className="form-label text-muted small">Phone Number</label>
//                   <input value={accountForm.values.phoneNumber} name='phoneNumber' type="tel" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control" placeholder="Phone" required />
//                   {accountForm.touched.phoneNumber && accountForm.errors.phoneNumber ? <div className="text-danger small mt-1">{accountForm.errors.phoneNumber}</div> : null}
//                 </div>

//                 <div className="d-grid">
//                   <button type="submit" className="btn btn-success btn-lg fw-bold p-2" disabled={!(accountForm.isValid && accountForm.dirty) || loading}>
//                     {loading ? <i className='fa fa-spinner fa-spin me-2'></i> : (role === 'seller' ? 'Next: Store Details' : 'Sign Up')}
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* Step 2 Form */}
//             {step === 2 && (
//               <form onSubmit={sellerForm.handleSubmit} className="mt-3">
//                 <div className="alert alert-success p-2 small text-center">✓ Personal account verified. Now register your factory/store.</div>
                
//                 <div className="mb-3">
//                   <label className="form-label text-muted small">Store Name (اسم المحل أو المصنع)</label>
//                   <input value={sellerForm.values.storeName} name='storeName' type="text" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control" placeholder="e.g. Al Bazar Factory" required />
//                   {sellerForm.touched.storeName && sellerForm.errors.storeName ? <div className="text-danger small mt-1">{sellerForm.errors.storeName}</div> : null}
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label text-muted small">Store Description (وصف المنتجات والنشاط)</label>
//                   <textarea value={sellerForm.values.description} name='description' rows="3" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control" placeholder="Describe your clothing categories..." required></textarea>
//                   {sellerForm.touched.description && sellerForm.errors.description ? <div className="text-danger small mt-1">{sellerForm.errors.description}</div> : null}
//                 </div>

//                 <div className="mb-4">
//                   <label className="form-label text-muted small">Store Contact Number (رقم التواصل التجاري)</label>
//                   <input value={sellerForm.values.contactNumber} name='contactNumber' type="tel" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control" placeholder="e.g. 010XXXXXXXX" required />
//                   {sellerForm.touched.contactNumber && sellerForm.errors.contactNumber ? <div className="text-danger small mt-1">{sellerForm.errors.contactNumber}</div> : null}
//                 </div>

//                 <div className="d-grid gap-2">
//                   <button type="submit" className="btn btn-success btn-lg fw-bold p-2" disabled={!(sellerForm.isValid && sellerForm.dirty) || loading}>
//                     {loading ? <i className='fa fa-spinner fa-spin me-2'></i> : 'Open My Store & Finish'}
//                   </button>
//                 </div>
//               </form>
//             )}

//             {step === 1 && (
//               <p className="text-center text-muted mt-4 small">
//                 Already have an account?{' '}
//                 <Link to="/login" className="text-decoration-none text-success fw-bold">Sign In</Link>
//               </p>
//             )}

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




























import React, { useContext, useState } from 'react';
import { useFormik } from 'formik'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { userContext } from '../../Context/userContext';
import { Helmet } from 'react-helmet';

export default function Register() {
  let [message, setMessage] = useState('');
  let [loading, setLoading] = useState(false);
  let [role, setRole] = useState('user'); // 'user' أو 'seller'
  let [step, setStep] = useState(1); // Step 1: الحساب | Step 2: المتجر
  let [savedToken, setSavedToken] = useState(null); 
  let { setSellerOrUser, setSignupMessage } = useContext(userContext); // جلب الدوال لتحديث الـ Context
  let navigate = useNavigate();

  // 1️⃣ فورم بيانات الحساب الأساسية
  const accountForm = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: ""
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required').min(3, 'min length is 3').max(30, 'max length is 30'),
      email: Yup.string().required('Email is required').email('Enter valid email'),
      phoneNumber: Yup.string().required('Phone number is required').matches(/^01[1250][0-9]{8}$/, 'Phone number not valid'),
      password: Yup.string().required('Password is required').matches(/^[A-Z][a-z0-9]{6,8}$/, 'Not valid'),
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
              // لو بائع: تسجيل دخول تلقائي لأخذ توكن الصلاحية لإنشاء المتجر
              axios.post('https://egzone.runasp.net/api/Auth/login', {
                email: values.email,
                password: values.password
              })
              .then((loginRes) => {
                if (loginRes.data.token) {
                  setSavedToken(loginRes.data.token);
                  setStep(2); // التوجه لبيانات المتجر بنجاح
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

  // 2️⃣ فورم بيانات المتجر
  const sellerForm = useFormik({
    initialValues: {
      storeName: "",
      description: "",
      contactNumber: ""
    },
    validationSchema: Yup.object({
      storeName: Yup.string().required('Store name is required').min(3, 'Too short'),
      description: Yup.string().required('Description is required').min(10, 'Please write a good description'),
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

  // دالة موحدة للتحكم بالـ Role وتحديث الحالات والـ Context بشكل متزامن
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('role', selectedRole); // التخزين بصيغة مفتاح وقيمة صحيحة
    if (setSellerOrUser) setSellerOrUser(selectedRole); // إبلاغ الكونتكس بالاختيار الجديد فوراً
  };

  return (
    <>
      <Helmet>
        <title>{role === 'seller' ? 'Seller Registration' : 'Customer Registration'}</title>
      </Helmet>
      
      <div className="d-flex align-items-center justify-content-center mt-4 mb-4" style={{ minHeight: '70vh' }}>
        <div className="card shadow-lg w-100 p-2" style={{ maxWidth: '550px', minHeight: '520px' }} >
          <div className="card-body">
            
            <div className="text-center">
              <h1 className="card-title h3 fw-bold" style={{ color: '#198754' }}>
                {role === 'seller' ? 'Seller Hub Registration' : 'Create Account'}
              </h1>
              <p className="card-text text-muted">
                {step === 1 ? 'Fill in your personal credentials below' : 'Set up your online store details'}
              </p>
              {message ? <div className="alert alert-danger p-2 small text-start" style={{ wordBreak: 'break-word' }} role="alert">{message}</div> : null}
            </div>

            {/* تم حل المشكلة هنا: الآن الأزرار تغير الـ state وتدعم الـ Context والـ LocalStorage */}
            {step === 1 && (
              <div className="d-flex bg-light p-1 rounded mb-4 mt-3" style={{ border: '1px solid #ddd' }}>
                <button
                  type="button"
                  className={`btn flex-fill py-2 fw-bold border-0 ${role === 'user' ? 'btn-success text-white' : 'btn-light text-muted'}`}
                  onClick={() => handleRoleChange('user')}
                >
                  Customer
                </button>
                <button
                  type="button"
                  className={`btn flex-fill py-2 fw-bold border-0 ${role === 'seller' ? 'btn-success text-white' : 'btn-light text-muted'}`}
                  onClick={() => handleRoleChange('seller')}
                >
                  Seller / Factory
                </button>
              </div>
            )}

            {/* Step 1 Form */}
            {step === 1 && (
              <form onSubmit={accountForm.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small">Full Name</label>
                  <input value={accountForm.values.fullName} name='fullName' type="text" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control" placeholder="Enter your name" required />
                  {accountForm.touched.fullName && accountForm.errors.fullName ? <div className="text-danger small mt-1">{accountForm.errors.fullName}</div> : null}
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-muted small">Email Address</label>
                  <input value={accountForm.values.email} name='email' type="email" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control" placeholder="Email Address" required />
                  {accountForm.touched.email && accountForm.errors.email ? <div className="text-danger small mt-1">{accountForm.errors.email}</div> : null}
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Password</label>
                  <input value={accountForm.values.password} name='password' type="password" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control" placeholder="Password" required />
                  {accountForm.touched.password && accountForm.errors.password ? <div className="text-danger small mt-1">{accountForm.errors.password}</div> : null}
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small">Phone Number</label>
                  <input value={accountForm.values.phoneNumber} name='phoneNumber' type="tel" onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className="form-control" placeholder="Phone" required />
                  {accountForm.touched.phoneNumber && accountForm.errors.phoneNumber ? <div className="text-danger small mt-1">{accountForm.errors.phoneNumber}</div> : null}
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-success btn-lg fw-bold p-2" disabled={!(accountForm.isValid && accountForm.dirty) || loading}>
                    {loading ? <i className='fa fa-spinner fa-spin me-2'></i> : (role === 'seller' ? 'Next: Store Details' : 'Sign Up')}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 Form */}
            {step === 2 && (
              <form onSubmit={sellerForm.handleSubmit} className="mt-3">
                <div className="alert alert-success p-2 small text-center">✓ Personal account verified. Now register your factory/store.</div>
                
                <div className="mb-3">
                  <label className="form-label text-muted small">Store Name (اسم المحل أو المصنع)</label>
                  <input value={sellerForm.values.storeName} name='storeName' type="text" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control" placeholder="e.g. Al Bazar Factory" required />
                  {sellerForm.touched.storeName && sellerForm.errors.storeName ? <div className="text-danger small mt-1">{sellerForm.errors.storeName}</div> : null}
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Store Description (وصف المنتجات والنشاط)</label>
                  <textarea value={sellerForm.values.description} name='description' rows="3" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control" placeholder="Describe your clothing categories..." required></textarea>
                  {sellerForm.touched.description && sellerForm.errors.description ? <div className="text-danger small mt-1">{sellerForm.errors.description}</div> : null}
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small">Store Contact Number (رقم التواصل التجاري)</label>
                  <input value={sellerForm.values.contactNumber} name='contactNumber' type="tel" onChange={sellerForm.handleChange} onBlur={sellerForm.handleBlur} className="form-control" placeholder="e.g. 010XXXXXXXX" required />
                  {sellerForm.touched.contactNumber && sellerForm.errors.contactNumber ? <div className="text-danger small mt-1">{sellerForm.errors.contactNumber}</div> : null}
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success btn-lg fw-bold p-2" disabled={!(sellerForm.isValid && sellerForm.dirty) || loading}>
                    {loading ? <i className='fa fa-spinner fa-spin me-2'></i> : 'Open My Store & Finish'}
                  </button>
                </div>
              </form>
            )}

            {step === 1 && (
              <p className="text-center text-muted mt-4 small">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none text-success fw-bold">Sign In</Link>
              </p>
            )}

          </div>
        </div>
      </div>
    </>
  );
}