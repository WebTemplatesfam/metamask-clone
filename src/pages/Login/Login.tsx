import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoDiv from '../../components/LogoDiv/LogoDiv';
import GoBackIcon from '@mui/icons-material/ArrowBackIos';
import logoIcon from '../../assets/img/dbz_icon.png';
import { Button, Typography, FilledInput } from '@mui/material';
import { SHA256Hash } from '../../utils/crypto';
import { createMnemonicSeedRandom, createHDRootNodeFromMnemonic, createAccountFromHDRootNode } from '../../utils/ethers';
import './Login.css';
import * as storage from '../../services/storage';

function Login(props: any) {

    const navigate = useNavigate();

    const navigateBack = () =>  navigate(-1);

    const [pwd, setPwd] = useState('');
    const [error,SetError]=useState('');

    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => setPwd(e.target.value);

    


    const handleLogin = (e: any) => {
        if(!pwd.length || pwd.length < 8) {
            SetError('password less than 8 chars');
            return;
        }
        const hash = SHA256Hash(pwd);
        const pwdHash = storage.getPasswordHash();
        if (hash!==pwdHash) {
            SetError('password incorrect');
            return;
        }
        storage.setLoginPassword(hash);
        console.log(pwd);
        console.log(hash===pwdHash);
        console.log('Yeaaaaaah');
        window.location.replace("/");
    }

    const handleImportWalletFromMnemonic = (e: any) => {
        e.preventDefault();
        console.log('Clicckeeduu');
    }
    return (
        <div className="login-container">
            <img 
                src={logoIcon}
                alt="dbz_icon"
                className="login-icon"
            />
            <div id="title" style={{color: '#1876D1'}}>Z-Wallet</div>
            <div className="login-msg">Welcome Back!</div>
            <div className="login-actions-div">

                <Typography variant="body2" color="text.secondary">
                    Password
                </Typography>
                <FilledInput
                    type="password"
                    value={pwd}
                    onChange={handlePwdChange}
                    sx={{marginBottom: '20px', minWidth: '300px'}}
                />

                {error && 
                <Typography variant="body2" color="text.secondary" sx={{marginBottom:'20px', color: 'red'}}>
                    {error}
                </Typography>}
                <Button 
                    size="medium" 
                    color="primary" 
                    variant="contained"
                    onClick={handleLogin}
                >
                    Unlock
                </Button>
                <Button 
                    size="small" 
                    color="primary" 
                    variant="text"
                    onClick={handleImportWalletFromMnemonic}
                    sx={{ textTransform: 'none', marginTop:'10px'}}
                >
                    or import using secret phrase
                </Button>
            </div>
        </div>
    );
}

export default Login;