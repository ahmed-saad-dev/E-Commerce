import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx';

export default function Layout() {
  return (
    <div style={{position: "relative"}}>
      <Outlet></Outlet>
    </div>
  )
}

