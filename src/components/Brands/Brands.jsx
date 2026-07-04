import React from 'react'
import { Helmet } from 'react-helmet'
import { useAPI } from '../../hooks/useAPI'

export default function Brands() {

  let {prands} = useAPI();
  // console.log(prands);
  return (
    <div>
      <Helmet>
        <title>Brands</title>
      </Helmet>
      <div>
        {prands.map((el) => {
           return <div className='m-4'>
              <div>{el.name}</div>
              <img src={el.image} alt="" className='border mx-4 my-3'/>
           </div>
        })}
      </div>
    </div>
  )
}

