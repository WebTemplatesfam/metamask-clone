import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoDiv from '../../components/LogoDiv/LogoDiv';
import GoBackIcon from '@mui/icons-material/ArrowBackIos';
import { Button, Typography, FilledInput } from '@mui/material';
import { createMnemonicSeedRandom, createHDRootNodeFromMnemonic, createAccountFromHDRootNode } from '../../utils/ethers';
import './CreatePassword.css';
import { SHA256Hash } from '../../utils/crypto';
import * as storage from '../../services/storage';

function CreatePassword(props: any) {

    const navigate = useNavigate();

    const navigateBack = () =>  navigate(-1);

    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [error,setError]=useState('');

    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        setError('');
        e.preventDefault();
        setPwd(e.target.value);
    }

    const handleConfirmPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setConfirmPwd(e.target.value);
    }  
    

   const _generateAndStoreMnemonicAndAccount = () => {
       const mnemonic = createMnemonicSeedRandom();
       const HDRoot = createHDRootNodeFromMnemonic(mnemonic);
       const newAccIndex = storage.getLastPathIndex() + 1;
       const account = createAccountFromHDRootNode(HDRoot, newAccIndex);
       storage.setMnemonic(mnemonic);
       storage.setAccount(account);
       storage.setAccountName(`Account ${newAccIndex+1}`, account.address);
       storage.setAccountIndex(newAccIndex)
       storage.setLastPathIndex(newAccIndex);
   }

    const setPasswordAndCreateAccount = (e: any) => {
        if(!pwd.length || pwd.length < 8) {
            setError('password less than 8 chars');
            return;
        }
        if (pwd!==confirmPwd) {
            setError('password inputs don\'t match');
            return;
        }
        const hash = SHA256Hash(pwd);
        storage.setPassword(hash);
        storage.setLoginPassword(hash);
        _generateAndStoreMnemonicAndAccount();
        navigate('/seed/new');
    }



    return (
        <div>
        <LogoDiv />
        <Button 
            size="medium" 
            color="primary" 
            variant="text"
            onClick={navigateBack}
            sx={{marginTop: '10px'}}
        >
            <GoBackIcon sx={{width: 18, height: 18}} />
            Back
        </Button>
        <div  className="create-password-container">
            <div className="create-password-msg">Create Password</div>
            <div className="password-actions-div">

                <Typography variant="body2" color="text.secondary">
                    New Password (min 8 characters)
                </Typography>
                <FilledInput
                    type="password"
                    value={pwd}
                    onChange={handlePwdChange}
                    sx={{marginBottom: '20px', minWidth: '300px'}}
                />
                <Typography variant="body2" color="text.secondary">
                    Confirm Password
                </Typography>
                <FilledInput
                    type="text"
                    value={confirmPwd}
                    onChange={handleConfirmPwdChange}
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
                    onClick={setPasswordAndCreateAccount}
                >
                    Create
                </Button>
            </div>
        </div>
        </div>
    );
}

export default CreatePassword;