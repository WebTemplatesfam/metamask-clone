import React from 'react';
import logoIcon from '../../assets/img/dbz_icon.png';
import './LogoDiv.css';

function LogoDiv(props: any) {
    return (
        <div id="logo-div">
            <img 
                src={logoIcon}
                alt="dbz_icon"
                className="logo-icon"
            />
            <div id="title">Z-Wallet</div>
        </div>
    );
}

export default LogoDiv;