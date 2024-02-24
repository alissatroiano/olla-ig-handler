import React from 'react';
import logoImg from '../../assets/images/logo.png';

function Logo() {
  return (
    <div className="logoImg">
        <a href='https://www.olla.ai/' target='_blank' rel="noreferrer">
      <img className="logoImg" src={logoImg} alt="Logo" />
      </a>
    </div>
  );
}

export default Logo;
