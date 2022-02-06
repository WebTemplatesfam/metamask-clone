import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import LogoDiv from '../../components/LogoDiv/LogoDiv';
import { Button, Typography, TextareaAutosize } from '@mui/material';
import GoBackIcon from '@mui/icons-material/ArrowBackIos';
import './ConfirmSeed.css';
import * as storage from '../../services/storage';

function ConfirmSeed(props: any) {

    const mnemonic = storage.getMnemonic();
    if(!mnemonic) throw new Error('mnemonic seed not found');

    const navigate = useNavigate();

    const navigateBack = () =>  navigate(-1);   

    const [confirmSeed, setConfirmSeed] = useState('');
    const [error, setError] = useState('');
    const [isSeedMatch, setIsSeedMatch] = useState(false);
    
    const handleConfirmSeedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError('');
        setConfirmSeed(e.target.value);
    };

    const handleConfirm= (e: any) => {
        const confirmationPhrase = confirmSeed.trim();
        const mnemonic = storage.getMnemonic();
        if(mnemonic!==confirmationPhrase.trim()) {
            setError('seed phrase doesn\'t match');
            return;
        }
        window.location.replace("/");        
    };

    useEffect(() => {
        const mnemonic = storage.getMnemonic();
        if(confirmSeed.trim()===mnemonic)
            setIsSeedMatch(true);
        else 
            setIsSeedMatch(false);
    }, [confirmSeed])


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
        <div  className="confirm-seed-container">
            <div className="confirm-seed-msg">Confirm your Secret Recovery Phrase</div>
            <div className="confirm-seed-actions-div">
                <Typography variant="body2" color="text.secondary">
                    Please type each phrase in order to make sure it is correct.
                </Typography>
                <TextareaAutosize
                    onChange={handleConfirmSeedChange}
                    aria-label="minimum height"
                    style={{ 
                        width: 300, minHeight: 120, margin: '20px 0', padding:'10px 0', 
                        fontSize: '18px',  textAlign:'center', lineHeight: '2' 
                    }}
                />
                {error &&
                    <Typography variant="body2" sx={{color: 'red', marginBottom: '20px'}}>
                        {error}
                    </Typography>
                }
                <Button 
                    size="medium" 
                    color="primary" 
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!isSeedMatch}
                >
                    Confirm
                </Button>
            </div>
        </div>
        </div>
    );
}

export default ConfirmSeed;