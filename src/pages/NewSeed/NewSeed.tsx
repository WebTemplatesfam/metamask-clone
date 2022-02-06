import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import LogoDiv from '../../components/LogoDiv/LogoDiv';
import { Button, Typography, } from '@mui/material';
import ViewSeed from '../../components/ViewSeed/ViewSeed';
import './NewSeed.css';
import { getMnemonic } from '../../services/storage';

function NewSeed(props: any) {

    const mnemonic = getMnemonic();
    if(!mnemonic) throw new Error('mnemonic seed not found');

    const [isSeedHidden, setIsSeedHidden] = useState(true);

    const navigate = useNavigate();

    const handleNext= (e: any)=> {
        navigate('/seed/confirm');
    };

    return (
        <div>
        <LogoDiv />
        <div  className="new-seed-container">
            <div className="new-seed-msg">Secret Recovery Phrase</div>
            <div className="new-seed-actions-div">
                <Typography variant="body2" color="text.secondary">
                    Your Secret Recovery Phrase makes it easy to back up and restore your account.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether forever.
                </Typography>
                <ViewSeed 
                    isSeedHidden={isSeedHidden}
                    setIsSeedHidden={setIsSeedHidden}
                />
                <Button 
                    size="medium" 
                    color="primary" 
                    variant="contained"
                    onClick={handleNext}
                    disabled={isSeedHidden}
                >
                    Next
                </Button>
            </div>
        </div>
        </div>
    );
}

export default NewSeed;