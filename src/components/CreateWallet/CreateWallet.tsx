import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import CreateAccountIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';


function CreateWallet(props: any) {

    const navigate = useNavigate();

    const setPasswordAndCreateWallet = () => navigate("/password");

    return (
        <Card sx={{ maxWidth: 350,  minHeight: 250}}>
            <CardActionArea>
                <Button 
                    variant="text"
                    size="small"
                >
                    <CreateAccountIcon sx={{width: 48, height: 48}} />
                </Button>
                <CardContent sx={{minHeight: 150}}>
                    <Typography gutterBottom variant="h6" component="div">
                        Yes, let’s get set up!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This will create a new wallet and Secret Recovery Phrase
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
            <Button 
                size="medium" 
                color="primary" 
                variant="contained"
                onClick={setPasswordAndCreateWallet}
            >
                Create A Wallet
            </Button>
            </CardActions>
      </Card>
    );
}

export default CreateWallet;