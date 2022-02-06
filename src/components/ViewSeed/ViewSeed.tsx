import React, { useEffect, useState } from 'react';
import { Button,  Typography, Card, CardContent, CardActionArea, CardActions } from '@mui/material';
import { decryptData } from '../../utils/crypto';
import * as storage from '../../services/storage';



function ViewSeed(props: any) {

    const defaultStyles = {
        cursor:'pointer',
        width: 350, 
        margin: '20px', 
        marginBottom: '20px', 
        textAlign: 'center'
    };

    const { isSeedHidden, setIsSeedHidden } = props; 

    const mnemonic = storage.getMnemonic();

    return (
        <Card 
            sx={isSeedHidden ? defaultStyles: {...defaultStyles, cursor: 'auto'}}
        >
            <CardContent>
                {isSeedHidden ? 
                    <Typography 
                        variant="h6" 
                        component="div" 
                        onClick={() => setIsSeedHidden(!isSeedHidden)}
                    > 
                        View Seed 
                    </Typography> :
                    <Typography gutterBottom variant="h6" component="div">
                        {mnemonic}
                    </Typography>
                }   
            </CardContent>
        </Card>
    );
}

export default ViewSeed;