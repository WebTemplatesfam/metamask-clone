import React, { useEffect, useState } from 'react';
import { Button, TextField, List, ListItem  } from '@mui/material';
import { estimateTxnFee, formatInUnits, parseFromUnits } from '../utils/ethers';
import { BigNumber } from 'ethers';
import SelectAsset from './SelectAsset';


function SendTokenOptions(props: any) {

    const { provider, chainID, accountBalance, setAccountBalance,  amount, getMaxAmount, setAmount, feeAmount, setFeeAmount, handleCancelSend, handleNext, assets, currentAsset, setCurrentAsset, maxAmount } = props;

    const [sendAmtError, setSendAmtError] = useState('');

    const handleAmountChange = async (e: any) => {
        setSendAmtError('');
        const amtText = e.target.value;
        setAmount(amtText)
        if(amtText) {
            const [integerPart, decimalPart] = amtText.split('.');
            if(decimalPart?.length>8) return;
        }
        if(isNaN(amtText)) {
            setSendAmtError('invalid amount');
            return;
        }
        const amt =  amtText ? parseFromUnits(amtText, currentAsset?.decimals) : BigNumber.from('0');
        if(maxAmount.lt(amt)) {
            setSendAmtError('insufficient funds');
            return;
        }
      }
    
      const updateAmountToMax = async () => {
        const maxAmt = await getMaxAmount(feeAmount);
        if(!maxAmt) {
            setAmount('0');
            return;
        }
        const maxAmtInUnits = formatInUnits(maxAmt,currentAsset.decimals);
        setAmount(maxAmtInUnits.substring(0,10));
      };
    
    
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-around', alignItems:'flex-start', marginTop: '20px', width:'100%'}}>
            <List>
                <ListItem sx={{width: '100%'}}>
                    <SelectAsset
                        chainID = {chainID}
                        accountBalance={accountBalance}
                        setAccountBalance={setAccountBalance}
                        assets={assets}
                        currentAsset={currentAsset}
                        setCurrentAsset={setCurrentAsset}
                    />
                </ListItem> 
                <ListItem sx={{width: '100%'}}>
                    <TextField 
                        id="outlined-basic" 
                        label="Amount" 
                        variant="outlined" 
                        value={amount}
                        onChange={handleAmountChange}
                        sx={{minWidth: '250px'}}
                    />
                    <Button 
                        size="small" 
                        color="primary" 
                        variant="text"
                        onClick={updateAmountToMax}
                        sx={{textTransform: 'none', postion: 'relative', right: '75px', cursor:'pointer'}}
                    >
                        Max
                    </Button>
                </ListItem> 
                {sendAmtError && 
                <ListItem>
                    <span style={{color: 'red', marginTop:'0px'}}>{sendAmtError}</span>
                </ListItem>}
            </List>

            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: '20px'}}>
                <Button 
                    size="large" 
                    color="primary" 
                    variant="outlined"
                    onClick={handleCancelSend}
                    sx={{textTransform: 'none', cursor:'pointer', marginLeft: '20px', marginRight: '20px'}}
                >
                    Cancel
                </Button>
                <Button 
                    size="large" 
                    color="primary" 
                    variant="contained"
                    onClick={handleNext}
                    // disabled={sendAmtError || !Number(amount) ? true : false}
                    sx={{textTransform: 'none', cursor:'pointer'}}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default SendTokenOptions;