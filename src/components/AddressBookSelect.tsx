import React from 'react';
import { Button, Divider, List, ListItem  } from '@mui/material';
import GoBackIcon from '@mui/icons-material/ArrowBackIos';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import * as storage from '../services/storage';
import { getAccountBackgroundColor } from '../utils/color';

const accountStyles = (account: any) => {
    const styles: any = {
        width: '32px',
        height:'32px',
        borderRadius: '50%',
        padding: '4px',
        backgroundColor: getAccountBackgroundColor(account.address)
    };
    return styles;
};

function AddressBookSelect(props: any) {


    const { accounts, displayUserAccounts, handleDisplayUserAccounts, handleTransferBetweenAccounts } = props;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-around', alignItems:'flex-start', marginTop: '20px', width:'100%'}}>
        <Button 
            size="medium" 
            color="primary" 
            variant="text"
            onClick={handleDisplayUserAccounts}
            sx={{textTransform: 'none'}}
        >
            {!displayUserAccounts ?
                'Transfer between my accounts':
                <>
                <GoBackIcon sx={{width: 18, height: 18}} />
                    Back
                </>
            }
        </Button>
        {displayUserAccounts &&
        <List>
            <ListItem sx={{width: '100%'}}>My Accounts</ListItem> 
            <Divider sx={{ my: 0.5 }} />
            {accounts.map((account: any, index: number) => 
                <ListItem 
                    key={account.address+index}
                    sx={{cursor: 'pointer'}}
                    onClick={() => handleTransferBetweenAccounts(account.address, index)}  
                > 
                    <AccountBalanceWalletIcon sx={accountStyles(account)} />
                    <span style={{marginLeft: '5px'}}>{storage.getAccountName(account.address) ? storage.getAccountName(account.address) : `Account ${index+1}`}</span>
                </ListItem>
            )}
        </List>}
    </div>
    );
}

export default AddressBookSelect;