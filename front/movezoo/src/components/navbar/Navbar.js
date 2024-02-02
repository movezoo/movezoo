import React from 'react';
import Shop from './shop/Shop';
import Ranking from './ranking/Ranking';
import Friend from './Friend';
import Setting from './Setting';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {

  return (
    <div className="navbar-container">
      
      <div className='navbar-shop'>
        <button>
          <Shop/>
        </button>
      </div>

      <div className='navbar-ranking'>
        <button>
          <Ranking/>
        </button>
      </div>

      <div className='navbar-single'>
        <button>
          <Link to="/single">싱글</Link>
        </button>
      </div>

      <div className='navbar-multi'>
        <button>
          <Link to="/multi">멀티</Link>
        </button>
      </div>

      <div className='navbar-friend'>
        <button>
          <Friend/>
        </button>
      </div>

      <div className='navbar-setting'>
        <button> 
          <Setting/>
        </button>
      </div>

    </div>
  );
}

export default Navbar;
