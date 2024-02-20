import React from 'react';
import Shop from './shop/Shop';
import Ranking from './ranking/Ranking';
import Setting from './setting/Setting';
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

      {/* <div className='navbar-setting'>
        <Setting/>
      </div> */}

    </div>
  );
}

export default Navbar;
