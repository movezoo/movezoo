import React from 'react';
import Shop from './Shop';
import Ranking from './Ranking';
import Friend from './Friend';
import Setting from './Setting';
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
      <button>
      <Link to="/single">싱글</Link>
      </button>
      </div>

      <div className='navbar-multi'>
      <button>멀티</button>
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
