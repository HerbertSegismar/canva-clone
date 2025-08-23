import React from 'react'

const Footer = () => {
  return (
    <div>
        <p className='text-sm text-slate-400 text-center font-light'><span className='text-amber-400'>&copy;</span>&nbsp;Copyright {new Date().getFullYear()} Herb Segismar</p>
    </div>
  )
}

export default Footer