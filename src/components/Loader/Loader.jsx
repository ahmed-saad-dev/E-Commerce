import React from 'react';
import { ThreeCircles } from 'react-loader-spinner';

export default function Loader() {
  return (
    <div className='vh-100 d-flex justify-content-center align-items-center'>
      <ThreeCircles
  visible={true}
  height="100"
  width="100"
  color="#381987"
  ariaLabel="three-circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
    </div>
  )
}

