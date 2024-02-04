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

      <div className='navbar-single'>
        <Link to="/single">싱글</Link>
      </div>

      <div className='navbar-multi'>
        <Link to="/multi">멀티</Link>
      </div>

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
