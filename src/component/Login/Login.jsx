// import React, { useContext, useEffect, useState } from 'react'
// import { Formik, useFormik, validateYupSchema } from 'formik' 
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import * as Yup from 'yup';
// import { userContext } from '../../Context/userContext';
// import { Helmet } from 'react-helmet';

// export default function Login() {
  
//   // let {isLogin, setLogin} = useContext(userContext);
//   let [message, setMessage] = useState('');
//   let [loading, setLoading] = useState(false);
//   let navigate = useNavigate();
//   let {isSellerOrUser, setSellerEmail} = useContext(userContext);
//   let permission = useContext(userContext);

//   // let formdata;
//  async function formMaipulation(formData) {
//   let formdata = formData.email;
  
//   setLoading(true)
//   axios.post('https://egzone.runasp.net/api/Auth/login',formData)
//   .then((response) =>{ 
//     //
//     setSellerEmail(formData?.email);
//     //

//     if(response.data.token) {
//       // console.log(response);
//       if(isSellerOrUser == 'seller') {
//         permission.setLogin(response?.data?.token);
//       localStorage.setItem('userToken', response?.data?.token);
//       setLoading(false); 
//       navigate('/Seller');
//     } else if (isSellerOrUser == 'user') {
//       permission.setLogin(response?.data?.token);
//       localStorage.setItem('userToken', response?.data?.token);
//       setLoading(false); 
//       navigate('/')
//     }
//   }
//   })
//   .catch((error) => {
//     setLoading(false);
//     setMessage(error?.response?.data)})
//   //
//   }

//   // useEffect(()=> {
//   //   setSellerEmail(formdata.email);
//   //   localStorage.setItem("userToken", formData.email);
//   // }, [sellerEmail])

//  let formObject =  useFormik({ 

//     initialValues:{
//       email:'',
//       password:'',
//     },
//     // validate: customValidation,
//     validationSchema: Yup.object({
//       email:Yup.string().required('email is required').email('enter valid email'),
//       password:Yup.string().required('password is required').matches(/^[A-Z][a-z0-9]{6,8}$/, 'Not valid'),
//     }),
//     onSubmit: formMaipulation,
//   })

//   return (
//     <>
//     <Helmet>
//         <title>Login</title>
//       </Helmet>
//          <div className=" d-flex align-items-center justify-content-center mt-4 mb-4" style={{ minHeight: '70vh' }}>
//       <div className="card shadow-lg w-100 p-2 pb-4" style={{ maxWidth: '550px',height: '405px' }} >
//         <div className="card-body">
//           <div className="text-center">
//             <h1 className="card-title h3 fw-bold" style={{color: '#198754'}}>Sign In</h1>
//             {/* <p className="card-text text-muted">Sign in below to access your account</p> */}
//             {/* {message? <div className="alert alert-primary" role="alert">{message}</div> : null} */}
//           </div>
//           <div className="mt-4">
//             <form onSubmit={formObject.handleSubmit}>
             
//               <div className="mb-4 ">
//                 <label htmlFor="email" className="form-label text-muted">Email Address</label>
//                 <input  value = {formObject.values.email} name='email' type="email" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="email" placeholder="Email Address" required />
//                 <div  className='delay'>{formObject.touched.email && formObject.errors.email? <div class="alert alert-danger" role="alert">{formObject.errors.email}</div>: null}</div>
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="password" className="form-label text-muted">Password</label>
//                 <input  value = {formObject.values.password} name='password' type="password" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="password" placeholder="Password" required />
//                 <div  className='delay'>{formObject.touched.password && formObject.errors.password? <div class="alert alert-danger" role="alert">{formObject.errors.password}</div>: null}</div>
//               </div>
              
//               <div className="d-grid">
//                 {
//                   isSellerOrUser == 'seller'? <button type="submit" className="btn-lg fw-bold p-1 rounded border-0 " style={{backgroundColor: '#1a223f', fontSize: '20px', color: 'white'}} disabled ={!(formObject.isValid && formObject.dirty)}>Sign In</button>:
//                   <button type="submit" className="btn-lg fw-bold p-1 rounded border-0 " style={{backgroundColor: '#6366F1', fontSize: '20px', color: 'white'}} disabled ={!(formObject.isValid && formObject.dirty)}>Sign In</button>
//                 }
//               </div>
//                 <p className="text-center text-muted mt-4">
//                     Don't have an account yet?{' '}
//                     <a href="/register" className="text-decoration-none text-success ">Sign up</a>.
//                 </p>
//                 <div className='text-center' style={{fontSize: '20px', margin: "10px auto"}}>{loading? <i className='fa fa-spinner fa-spin m-1 '></i>: null}</div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   )


// }  اللي كان قبل ال test admin


















// test Admin=================================================================================
import React, { useContext, useEffect, useState } from 'react'
import { Formik, useFormik, validateYupSchema } from 'formik' 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { userContext } from '../../Context/userContext';
import { Helmet } from 'react-helmet';

export default function Login() {
  
  let [message, setMessage] = useState('');
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  let { isSellerOrUser, setSellerEmail, setSellerOrUser } = useContext(userContext);
  let permission = useContext(userContext);

  // async function formMaipulation(formData) {
  //   setLoading(true);
  //   setMessage(''); // تصفية أي رسائل خطأ قديمة

  //   // 1️⃣ فحص بيانات الـ Admin أولاً
  //   const adminEmail = "AS@gmail.com";
  //   const adminPassword = "pass123";

  //   if (formData.email.trim() === adminEmail && formData.password === adminPassword) {
  //     axios.post('https://egzone.runasp.net/api/Auth/login', formData)
  //       .then((response) => {
  //         if (response.data.token) {
  //           permission.setLogin(response?.data?.token);
  //           localStorage.setItem('userToken', response?.data?.token);
            
  //           // تخزين دور الـ Admin لتأمين الحساب والـ Refresh
  //           localStorage.setItem('role', 'admin');
  //           if (setSellerOrUser) setSellerOrUser('admin'); 

  //           setLoading(false);
  //           navigate('/admin'); // توجيهه للوحة تحكم الويب للآدمن
  //         }
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         setMessage(error?.response?.data || "خطأ في تسجيل دخول المسؤول");
  //       });
  //     return; // توقيف الدالة هنا حتى لا يمر على شروط الـ User والـ Seller
  //   }

  //   // 2️⃣ المسار الطبيعي لـ البائع والمستخدم العادي
  //   axios.post('https://egzone.runasp.net/api/Auth/login', formData)
  //     .then((response) => { 
  //       console.log('GPT: ', response.data);
  //       setSellerEmail(formData?.email);

  //       if (response.data.token) {
  //         permission.setLogin(response?.data?.token);
  //         localStorage.setItem('userToken', response?.data?.token);

  //         if (isSellerOrUser == 'seller') {
  //           localStorage.setItem('role', 'seller');
  //           setLoading(false); 
  //           navigate('/Seller');
  //         } else if (isSellerOrUser == 'user') {
  //           localStorage.setItem('role', 'user');
  //           setLoading(false); 
  //           navigate('/');
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       setMessage(error?.response?.data || "Invalid email or password");
  //     });
  // }













  async function formMaipulation(formData) {
    setLoading(true);
    setMessage(''); // تصفية أي رسائل خطأ قديمة

    // 1️⃣ فحص بيانات الـ Admin أولاً
    const adminEmail = "AS@gmail.com";
    const adminPassword = "pass123";

    if (formData.email.trim() === adminEmail && formData.password === adminPassword) {
      axios.post('https://egzone.runasp.net/api/Auth/login', formData)
        .then((response) => {
          if (response.data.token) {
            permission.setLogin(response?.data?.token);
            localStorage.setItem('userToken', response?.data?.token);
            
            // تخزين دور الـ Admin لتأمين الحساب والـ Refresh
            localStorage.setItem('role', 'admin');
            if (setSellerOrUser) setSellerOrUser('admin'); 

            setLoading(false);
            navigate('/admin'); // توجيهه للوحة تحكم الويب للآدمن
          }
        })
        .catch((error) => {
          setLoading(false);
          setMessage(error?.response?.data || "خطأ في تسجيل دخول المسؤول");
        });
      return; 
    }

    // 2️⃣ المسار الطبيعي لـ البائع والمستخدم العادي
    axios.post('https://egzone.runasp.net/api/Auth/login', formData)
      .then((response) => { 
        console.log('API Response data: ', response.data);
        setSellerEmail(formData?.email);
        let the_Role = localStorage.getItem('role');
        if (response.data.token) {
          permission.setLogin(response?.data?.token);
          localStorage.setItem('userToken', response?.data?.token);

          // 🔥 الحل هنا: بنجيب الـ role اللي راجع من الـ API (لو الـ backend بيرجعه) 
          // أو بنجبر السيستم يعتمد على الاختيار الحالي للـ Context والـ localStorage سوا
          const currentRole = response.data.role || isSellerOrUser;

          if (the_Role == 'seller') {
            // localStorage.setItem('role', 'seller');
            if (setSellerOrUser) setSellerOrUser('seller'); // تحديث الـ Context برضه
            setLoading(false); 
            navigate('/Seller');
          } else if (the_Role == 'user') {
            // localStorage.setItem('role', 'user');
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
      email: Yup.string().required('email is required').email('enter valid email'),
      // تم إزالة الـ matches للـ Regex المعقد حتى لا يمنع كلمة مرور الآدمن (pass123) من العبور
      password: Yup.string().required('password is required'),
    }),
    onSubmit: formMaipulation,
  })

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="d-flex align-items-center justify-content-center mt-4 mb-4" style={{ minHeight: '70vh' }}>
        <div className="card shadow-lg w-100 p-2 pb-4" style={{ maxWidth: '550px', height: 'auto' }} >
          <div className="card-body">
            <div className="text-center">
              <h1 className="card-title h3 fw-bold" style={{ color: '#198754' }}>Sign In</h1>
              {message ? <div className="alert alert-danger mt-2" role="alert">{message}</div> : null}
            </div>
            <div className="mt-4">
              <form onSubmit={formObject.handleSubmit}>
               
                <div className="mb-4">
                  <label htmlFor="email" className="form-label text-muted">Email Address</label>
                  <input value={formObject.values.email} name='email' type="email" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="email" placeholder="Email Address" required />
                  <div className='delay'>{formObject.touched.email && formObject.errors.email ? <div className="alert alert-danger p-2 mt-1" role="alert">{formObject.errors.email}</div> : null}</div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label text-muted">Password</label>
                  <input value={formObject.values.password} name='password' type="password" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="password" placeholder="Password" required />
                  <div className='delay'>{formObject.touched.password && formObject.errors.password ? <div className="alert alert-danger p-2 mt-1" role="alert">{formObject.errors.password}</div> : null}</div>
                </div>
                
                <div className="d-grid">
                  {isSellerOrUser == 'seller' ? 
                    <button type="submit" className="btn-lg fw-bold p-1 rounded border-0" style={{ backgroundColor: '#1a223f', fontSize: '20px', color: 'white' }} disabled={!(formObject.isValid && formObject.dirty)}>Sign In</button> :
                    <button type="submit" className="btn-lg fw-bold p-1 rounded border-0" style={{ backgroundColor: '#6366F1', fontSize: '20px', color: 'white' }} disabled={!(formObject.isValid && formObject.dirty)}>Sign In</button>
                  }
                </div>
                
                <p className="text-center text-muted mt-4">
                  Don't have an account yet?{' '}
                  <a href="/register" className="text-decoration-none text-success">Sign up</a>.
                </p>
                <div className='text-center' style={{ fontSize: '20px', margin: "10px auto" }}>{loading ? <i className='fa fa-spinner fa-spin m-1'></i> : null}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// test Admin=================================================================================















// import React, { useContext, useEffect, useState } from 'react'
// import { Formik, useFormik, validateYupSchema } from 'formik' 
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import * as Yup from 'yup';
// import { userContext } from '../../Context/userContext';
// import { Helmet } from 'react-helmet';

// export default function Login() {
//   
//   // let {isLogin, setLogin} = useContext(userContext);
//   let [message, setMessage] = useState('');
//   let [loading, setLoading] = useState(false);
//   let navigate = useNavigate();
//   let {isSellerOrUser, setSellerEmail} = useContext(userContext);
//   let permission = useContext(userContext);

//   // let formdata;
//  async function formMaipulation(formData) {
//   let formdata = formData.email;
//   setSellerEmail(formdata)
//   setLoading(true)
//   axios.post('https://egzone.runasp.net/api/Auth/login',formData)
//   .then((response) =>{ 
//     //
//     setSellerEmail(formData?.email);
//     //

//     if(response.data.token) {
//       // console.log(response);
//       if(isSellerOrUser == 'seller') {
//         permission.setLogin(response?.data?.token);
//       localStorage.setItem('userToken', response?.data?.token);
//       setLoading(false); 
//       navigate('/Seller');
//     } else if (isSellerOrUser == 'user') {
//       permission.setLogin(response?.data?.token);
//       localStorage.setItem('userToken', response?.data?.token);
//       setLoading(false); 
//       navigate('/')
//     }
//   }


//   localStorage.clear(); // أو يدوياً: localStorage.removeItem("userToken");

//     // 👈 تخزين التوكن الجديد النظيف
//     localStorage.setItem("userToken", res.data.token);
//     
//     // اتقل للصفحة اللي بعدها
//     navigate("/dashboard");



//     
//   })
//   .catch((error) => {
//     setLoading(false);
//     setMessage(error?.response?.data)})
//   //
//   }

//   // useEffect(()=> {
//   //   setSellerEmail(formdata.email);
//   //   localStorage.setItem("userToken", formData.email);
//   // }, [sellerEmail])

//  let formObject =  useFormik({ 

//     initialValues:{
//       email:'',
//       password:'',
//     },
//     // validate: customValidation,
//     validationSchema: Yup.object({
//       email:Yup.string().required('email is required').email('enter valid email'),
//       password:Yup.string().required('password is required').matches(/^[A-Z][a-z0-9]{6,8}$/, 'Not valid'),
//     }),
//     onSubmit: formMaipulation,
//   })

//   return (
//     <>
//     <Helmet>
//         <title>Login</title>
//       </Helmet>
//          <div className=" d-flex align-items-center justify-content-center mt-4 mb-4" style={{ minHeight: '70vh' }}>
//       <div className="card shadow-lg w-100 p-2 pb-4" style={{ maxWidth: '550px',height: '405px' }} >
//         <div className="card-body">
//           <div className="text-center">
//             <h1 className="card-title h3 fw-bold" style={{color: '#198754'}}>Sign In</h1>
//             {/* <p className="card-text text-muted">Sign in below to access your account</p> */}
//             {/* {message? <div className="alert alert-primary" role="alert">{message}</div> : null} */}
//           </div>
//           <div className="mt-4">
//             <form onSubmit={formObject.handleSubmit}>
//              
//               <div className="mb-4 ">
//                 <label htmlFor="email" className="form-label text-muted">Email Address</label>
//                 <input  value = {formObject.values.email} name='email' type="email" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="email" placeholder="Email Address" required />
//                 <div  className='delay'>{formObject.touched.email && formObject.errors.email? <div class="alert alert-danger" role="alert">{formObject.errors.email}</div>: null}</div>
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="password" className="form-label text-muted">Password</label>
//                 <input  value = {formObject.values.password} name='password' type="password" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="password" placeholder="Password" required />
//                 <div  className='delay'>{formObject.touched.password && formObject.errors.password? <div class="alert alert-danger" role="alert">{formObject.errors.password}</div>: null}</div>
//               </div>
//               
//               <div className="d-grid">
//                 {
//                   isSellerOrUser == 'seller'? <button type="submit" className="btn-lg fw-bold p-1 rounded border-0 " style={{backgroundColor: '#1a223f', fontSize: '20px', color: 'white'}} disabled ={!(formObject.isValid && formObject.dirty)}>Sign In</button>:
//                   <button type="submit" className="btn-lg fw-bold p-1 rounded border-0 " style={{backgroundColor: '#6366F1', fontSize: '20px', color: 'white'}} disabled ={!(formObject.isValid && formObject.dirty)}>Sign In</button>
//                 }
//               </div>
//                 <p className="text-center text-muted mt-4">
//                     Don't have an account yet?{' '}
//                     <a href="/register" className="text-decoration-none text-success ">Sign up</a>.
//                 </p>
//                 <div className='text-center' style={{fontSize: '20px', margin: "10px auto"}}>{loading? <i className='fa fa-spinner fa-spin m-1 '></i>: null}</div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   )


// }














// import React, { useContext, useState } from 'react';
// import { useFormik } from 'formik'; 
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import * as Yup from 'yup';
// import { userContext } from '../../Context/userContext';
// import { Helmet } from 'react-helmet';

// export default function Login() {
//   let [message, setMessage] = useState('');
//   let [loading, setLoading] = useState(false);
//   let navigate = useNavigate();
//   let permission = useContext(userContext);

//   async function formManipulation(formData) {
//     setLoading(true);
//     axios.post('https://egzone.runasp.net/api/Auth/login', formData)
//       .then((response) => {
//         if(response.data.token) {
//           // حفظ التوكن والـ role القادم من الـ API (لو مش متاح افتراضياً خليه user)
//           const userRole = response.data.role || 'user';
//           localStorage.setItem('userToken', response.data.token);
//           localStorage.setItem('userRole', userRole);
          
//           // تحديث الـ Context
//           permission.setLogin(response.data.token, userRole);
//           setLoading(false);
          
//           // // توجيه ذكي حسب الحساب
//           // if (userRole === 'seller') {
//           //   navigate('/seller/dashboard');
//           // } else {
//           //   navigate('/');
//           // }
//         }
//       })
//       .catch((error) => {
//         setLoading(false);
//         setMessage(error?.response?.data || 'Invalid email or password');
//       });
//   }

//   let formObject = useFormik({ 
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().required('Email is required').email('Enter valid email'),
//       password: Yup.string().required('Password is required'),
//     }),
//     onSubmit: formManipulation,
//   });

//   return (
//     <>
//       <Helmet>
//         <title>Login - EgyZone</title>
//       </Helmet>
//       <div className="d-flex align-items-center justify-content-center mt-4 mb-4" style={{ minHeight: '70vh' }}>
//         <div className="card shadow-lg w-100 p-2 pb-4" style={{ maxWidth: '550px', height: 'auto' }} >
//           <div className="card-body">
//             <div className="text-center">
//               <h1 className="card-title h3 fw-bold" style={{ color: '#198754' }}>Sign In</h1>
//               {message ? <div className="alert alert-danger mt-2" role="alert">{message}</div> : null}
//             </div>
//             <div className="mt-4">
//               <form onSubmit={formObject.handleSubmit}>
//                 <div className="mb-4">
//                   <label htmlFor="email" className="form-label text-muted">Email Address</label>
//                   <input value={formObject.values.email} name='email' type="email" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="email" placeholder="Email Address" required />
//                   {formObject.touched.email && formObject.errors.email ? <div className="alert alert-danger p-2 mt-1" role="alert">{formObject.errors.email}</div> : null}
//                 </div>
                
//                 <div className="mb-4">
//                   <label htmlFor="password" className="form-label text-muted">Password</label>
//                   <input value={formObject.values.password} name='password' type="password" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="password" placeholder="Password" required />
//                   {formObject.touched.password && formObject.errors.password ? <div className="alert alert-danger p-2 mt-1" role="alert">{formObject.errors.password}</div> : null}
//                 </div>
                
//                 <div className="d-grid">
//                   <button type="submit" className="btn-lg fw-bold p-1 rounded border-0" style={{ backgroundColor: '#198754', fontSize: '20px', color: 'white' }} disabled={!(formObject.isValid && formObject.dirty)}>
//                     {loading ? <i className='fa fa-spinner fa-spin m-1'></i> : 'Sign In'}
//                   </button>
//                 </div>

//                 <p className="text-center text-muted mt-4">
//                   Don't have an account yet?{' '}
//                   <Link to="/register" className="text-decoration-none text-success fw-bold">Sign up</Link>.
//                 </p>
//                 <div className="text-center mt-2">
//                   <Link to="/" className="text-decoration-none text-secondary small">Continue to website as a Guest</Link>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// } اصلي 1













// import React, { useContext, useState } from 'react';
// import { useFormik } from 'formik'; 
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import * as Yup from 'yup';
// import { userContext } from '../../Context/userContext';
// import { Helmet } from 'react-helmet';
// import { jwtDecode } from 'jwt-decode'; // استيراد مكتبة فك التوكن

// export default function Login() {
//   let [message, setMessage] = useState('');
//   let [loading, setLoading] = useState(false);
//   let navigate = useNavigate();
//   let permission = useContext(userContext);

//   async function formManipulation(formData) {
//     setLoading(true);
//     axios.post('https://egzone.runasp.net/api/Auth/login', formData)
//       .then((response) => {
//         if(response.data.token) {
//           const token = response.data.token;
          
//           // فك التوكن لقراءة الـ role من الـ payload الخاص بالسيرفر
//           const decoded = jwtDecode(token);
//           const extractedRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user';
//           const userRole = extractedRole.toLowerCase(); // تحويلها لـ lowercase لتجنب المشاكل

//           // حفظ البيانات في الـ LocalStorage والـ Context
//           localStorage.setItem('userToken', token);
//           localStorage.setItem('userRole', userRole);
//           permission.setLogin(token, userRole);
          
//           setLoading(false);
          
//           // التوجيه التلقائي الذكي فور تسجيل الدخول
//           if (userRole === 'seller') {
//             navigate('/seller/dashboard'); // توجيه البائع إلى لوحته
//           } else {
//             navigate('/'); // توجيه العميل أو الـ guest للهوم
//           }
//         }
//       })
//       .catch((error) => {
//         setLoading(false);
//         setMessage(error?.response?.data || 'Invalid email or password');
//       });
//   }

//   let formObject = useFormik({ 
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().required('Email is required').email('Enter valid email'),
//       password: Yup.string().required('Password is required'),
//     }),
//     onSubmit: formManipulation,
//   });

//   return (
//     <>
//       <Helmet>
//         <title>Login - EgyZone</title>
//       </Helmet>
//       <div className="d-flex align-items-center justify-content-center mt-4 mb-4" style={{ minHeight: '70vh' }}>
//         <div className="card shadow-lg w-100 p-2 pb-4" style={{ maxWidth: '550px', height: 'auto' }} >
//           <div className="card-body">
//             <div className="text-center">
//               <h1 className="card-title h3 fw-bold" style={{ color: '#198754' }}>Sign In</h1>
//               {message ? <div className="alert alert-danger mt-2" role="alert">{message}</div> : null}
//             </div>
//             <div className="mt-4">
//               <form onSubmit={formObject.handleSubmit}>
//                 <div className="mb-4">
//                   <label htmlFor="email" className="form-label text-muted">Email Address</label>
//                   <input value={formObject.values.email} name='email' type="email" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="email" placeholder="Email Address" required />
//                   {formObject.touched.email && formObject.errors.email ? <div className="alert alert-danger p-2 mt-1" role="alert">{formObject.errors.email}</div> : null}
//                 </div>
                
//                 <div className="mb-4">
//                   <label htmlFor="password" className="form-label text-muted">Password</label>
//                   <input value={formObject.values.password} name='password' type="password" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="password" placeholder="Password" required />
//                   {formObject.touched.password && formObject.errors.password ? <div className="alert alert-danger p-2 mt-1" role="alert">{formObject.errors.password}</div> : null}
//                 </div>
                
//                 <div className="d-grid">
//                   <button type="submit" className="btn-lg fw-bold p-1 rounded border-0" style={{ backgroundColor: '#198754', fontSize: '20px', color: 'white' }} disabled={!(formObject.isValid && formObject.dirty)}>
//                     {loading ? <i className='fa fa-spinner fa-spin m-1'></i> : 'Sign In'}
//                   </button>
//                 </div>

//                 <p className="text-center text-muted mt-4">
//                   Don't have an account yet?{' '}
//                   <Link to="/register" className="text-decoration-none text-success fw-bold">Sign up</Link>.
//                 </p>
//                 <div className="text-center mt-2">
//                   <Link to="/" className="text-decoration-none text-secondary small">Continue to website as a Guest</Link>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// } 











// import React, { useContext, useState } from 'react';
// import { useFormik } from 'formik'; 
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import * as Yup from 'yup';
// import { userContext } from '../../Context/userContext';
// import { Helmet } from 'react-helmet';
// import { jwtDecode } from 'jwt-decode'; 

// export default function Login() {
//   let [message, setMessage] = useState('');
//   let [loading, setLoading] = useState(false);
//   let navigate = useNavigate();
//   let permission = useContext(userContext);

//   async function formManipulation(formData) {
//     setLoading(true);
//     setMessage('');
//     axios.post('https://egzone.runasp.net/api/Auth/login', formData)
//       .then((response) => {
//         if(response.data.token) {
//           const token = response.data.token;
          
//           // فك التوكن لقراءة الـ role
//           const decoded = jwtDecode(token);
//           const extractedRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user';
          
//           // حماية إضافية لو الباكيند يرسل الـ role منفصلاً في الـ response
//           const finalRole = (response.data.role || extractedRole).toLowerCase();

//           // حفظ البيانات وتحديث الـ Context
//           localStorage.setItem('userToken', token);
//           localStorage.setItem('userRole', finalRole);
//           permission.setLogin(token, finalRole);
          
//           setLoading(false);
          
//           if (finalRole === 'seller' || finalRole === 'merchant') {
//             navigate('/seller/dashboard');
//           } else {
//             navigate('/');
//           }
//         }
//       })
//       .catch((error) => {
//         setLoading(false);
//         if (error?.response?.data?.message) {
//           setMessage(error.response.data.message);
//         } else {
//           setMessage('Invalid email or password');
//         }
//       });
//   }

//   let formObject = useFormik({ 
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().required('Email is required').email('Enter valid email'),
//       password: Yup.string().required('Password is required'),
//     }),
//     onSubmit: formManipulation,
//   });

//   return (
//     <>
//       <Helmet>
//         <title>Login - EgyZone</title>
//       </Helmet>
//       <div className="d-flex align-items-center justify-content-center mt-4 mb-4" style={{ minHeight: '70vh' }}>
//         <div className="card shadow-lg w-100 p-2 pb-4" style={{ maxWidth: '550px', height: 'auto' }} >
//           <div className="card-body">
//             <div className="text-center">
//               <h1 className="card-title h3 fw-bold" style={{ color: '#198754' }}>Sign In</h1>
//               {message ? <div className="alert alert-danger mt-2" role="alert">{message}</div> : null}
//             </div>
//             <div className="mt-4">
//               <form onSubmit={formObject.handleSubmit}>
//                 <div className="mb-4">
//                   <label htmlFor="email" className="form-label text-muted">Email Address</label>
//                   <input value={formObject.values.email} name='email' type="email" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="email" placeholder="Email Address" required />
//                   {formObject.touched.email && formObject.errors.email ? <div className="alert alert-danger p-2 mt-1" role="alert">{formObject.errors.email}</div> : null}
//                 </div>
                
//                 <div className="mb-4">
//                   <label htmlFor="password" className="form-label text-muted">Password</label>
//                   <input value={formObject.values.password} name='password' type="password" onChange={formObject.handleChange} onBlur={formObject.handleBlur} className="form-control" id="password" placeholder="Password" required />
//                   {formObject.touched.password && formObject.errors.password ? <div className="alert alert-danger p-2 mt-1" role="alert">{formObject.errors.password}</div> : null}
//                 </div>
                
//                 <div className="d-grid">
//                   <button type="submit" className="btn-lg fw-bold p-1 rounded border-0" style={{ backgroundColor: '#198754', fontSize: '20px', color: 'white' }} disabled={!(formObject.isValid && formObject.dirty)}>
//                     {loading ? <i className='fa fa-spinner fa-spin m-1'></i> : 'Sign In'}
//                   </button>
//                 </div>

//                 <p className="text-center text-muted mt-4">
//                   Don't have an account yet?{' '}
//                   <Link to="/register" className="text-decoration-none text-success fw-bold">Sign up</Link>.
//                 </p>
//                 <div className="text-center mt-2">
//                   <Link to="/" className="text-decoration-none text-secondary small">Continue to website as a Guest</Link>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }