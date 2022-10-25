import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,  Typography, Card, CardContent, CardActionArea, CardActions } from '@mui/material';
import ImportAccountIcon from '@mui/icons-material/Download';



function ImportWallet(props: any) {

    const navigate=useNavigate();

    const handleImportWallet = async () => {
        navigate('/wallet/import')
    }


    return (
        <Card sx={{ maxWidth: 350, minHeight: 250 }}>
            <CardActionArea>
                <Button 
                    variant="text"
                    size="small"
                    sx={{cursor: 'auto'}}
                >
                    <ImportAccountIcon sx={{width: 48, height: 48}} />
                </Button>
                <CardContent sx={{minHeight: 150}}>
                    <Typography gutterBottom variant="h6" component="div">
                        No, I already have a Secret Recovery Phrase
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Import your existing wallet using a Secret Recovery Phrase
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
            <Button 
                size="medium" 
                color="primary"
                variant="contained" 
                onClick={handleImportWallet}
            >
                Import Wallet
            </Button>
            </CardActions>
        </Card>
    );
}

export default ImportWallet;

