import React from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
import { Button,  Typography, Card, CardContent, CardActionArea, CardActions } from '@mui/material';
import ImportAccountIcon from '@mui/icons-material/Download';
import { relative } from 'path/posix';




function ImportWallet(props: any) {

    return (
        <Card sx={{ maxWidth: 350, minHeight: 250 }}>
            <CardActionArea>
                <Button 
                    variant="text"
                    size="small"
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
            <Button size="medium" color="primary" variant="contained" >
                Import Wallet
            </Button>
            </CardActions>
        </Card>
    );
}

export default ImportWallet;

