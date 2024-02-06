import React from 'react';
import Shop from './shop/Shop';
import Ranking from './ranking/Ranking';
import Friend from './friend/Friend';
import Setting from './setting/Setting';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {

  return (  
    <div className="navbar-container">
      
      <div className='navbar-shop'>
        <Shop/>
      </div>

      <div className='navbar-ranking'>
        <Ranking/>
      </div>
      
      <Link className='navbar-single' to="/single">
        <h1 className='single'>싱글</h1>
      </Link>
      
      <Link className='navbar-multi' to="/room">
        <h1 className='multi'>멀티</h1>
      </Link>
      
      <div className='navbar-friend'>
        <Friend/>
      </div>

      <div className='navbar-setting'>
        <Setting/>
      </div>

    </div>
  );
}

export default Navbar;
