import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import LogoDiv from '../../components/LogoDiv/LogoDiv';
import { Button, Typography, FilledInput, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { createMnemonicSeedRandom, createHDRootNodeFromMnemonic, createAccountFromHDRootNode, isValidMnemonicSeed } from '../../utils/ethers';
import { SHA256Hash } from '../../utils/crypto';
import GoBackIcon from '@mui/icons-material/ArrowBackIos';
import './ImportWallet.css';

import * as storage from '../../services/storage';

function ImportWallet(props: any) {
    
    const navigate = useNavigate();
    const navigateBack = () =>  navigate(-1);
    
    const [mnemonic, setSeed] = useState('');
    const [showSeed, setShowSeed] = useState(false);
    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [mnemonicError, setSeedError] = useState('');
    const [pwdError, setPwdError] = useState('');

    const handleSeedHidden = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.checked);
        setShowSeed(e.target.checked);
    }

    const handleSeedChange = (e: any) => {
        setSeedError('');
        const targetVal = e.target.value;
        setSeed(targetVal);
        if(!isValidMnemonicSeed(targetVal)) {
            setSeedError('invalid mnemonic phrase');
            return;
        };
    }

    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        e.preventDefault();
        setPwdError('');
        setPwd(e.target.value);
    }

    const handleConfirmPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setConfirmPwd(e.target.value);
    }  

    const _generateAndStoreMnemonicAndAccount = () => {
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
            setPwdError('password less than 8 chars');
            return;
        }
        if (pwd!==confirmPwd) {
            setPwdError('password inputs don\'t match');
            return;
        }
        const hash = SHA256Hash(pwd);
        storage.setPassword(hash);
        storage.setLoginPassword(hash);
        _generateAndStoreMnemonicAndAccount();
        window.location.replace('/');
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
        <div  className="import-wallet-container">
            <div className="import-wallet-msg">Import a wallet with Secret Recovery Phrase</div>
            <div className="import-wallet-actions-div">
                <Typography variant="body2" color="text.secondary" sx={{marginBottom: '20px'}}>
                    Only the first account on this wallet will auto load. After completing this process, to add additional accounts, click the drop down menu, then select Create Account.
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Secret Recovery Phrase
                </Typography>

                <div style={{marginBottom: '20px'}}>
                    <FilledInput
                        type={showSeed ? "text" : "password"}
                        value={mnemonic}
                        onChange={handleSeedChange}
                        sx={{minWidth: '300px'}}
                    />

                    {mnemonicError && <div style={{color: 'red'}}>{mnemonicError}</div>}
                
                    <FormGroup onChange={handleSeedHidden}>
                        <FormControlLabel control={<Checkbox />} label="Show secret recovery phrase" />
                    </FormGroup>
                </div>

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

                {pwdError && 
                <Typography variant="body2" color="text.secondary" sx={{marginBottom:'20px', color: 'red'}}>
                    {pwdError}
                </Typography>}

                <Button 
                    size="medium" 
                    color="primary" 
                    variant="contained"
                    onClick={setPasswordAndCreateAccount}
                    // disabled={isSeedHidden}
                >
                    Import
                </Button>
            </div>
        </div>
        </div>
    );
}

export default ImportWallet;