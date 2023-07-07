import React from 'react'
import { Link } from "react-router-dom";
import style from '../css/navbar.module.css';

export default function Navbar() {
  return (
    <div>
      <header className={ style.header }>
        <h2><Link to='/skambooks' className={ style.link }>My books</Link></h2>
        <h2><Link to='/exchange' className={ style.link }>My exchanges</Link></h2>
        <h2><Link to='/search' className={ style.link }>Search books</Link></h2>
        <h2><Link to='/' className={ style.link }>Logout</Link></h2>
      </header>
    </div>
  )
}
