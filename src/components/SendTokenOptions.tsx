import React, { useEffect, useState } from 'react';
import { Button, TextField, List, ListItem  } from '@mui/material';
import { estimateTxnFee, formatInUnits, parseFromUnits } from '../utils/ethers';
import { BigNumber } from 'ethers';
import SelectAsset from './SelectAsset';


function SendTokenOptions(props: any) {

    const { provider, chainID, accountBalance, setAccountBalance,  amount, setAmount, feeAmount, setFeeAmount, handleCancelSend, handleNext, assets, currentAsset, setCurrentAsset } = props;
    
    const [maxAmount, setMaxAmount] = useState(BigNumber.from('0'));

    useEffect(() => {
        const interval = setTimeout(async () => {
            const maxAmt = await getMaxAmount();
            if(!maxAmt) return BigNumber.from('0');
            setMaxAmount(maxAmt);
        }, 2000)

        return () => {
            clearInterval(interval);
        }
    })

    const [sendAmtError, setSendAmtError] = useState('');

    const handleAmountChange = async (e: any) => {
        setSendAmtError('')
        const amtText = e.target.value;
        setAmount(amtText);
        if(amtText) {
            const [integerPart, decimalPart] = amtText.split('.');
            if(decimalPart?.length>8) return;
        }
        if(isNaN(amtText)) {
            setSendAmtError('invalid amount');
            return;
        }
        const amt = parseFromUnits(amtText, currentAsset?.decimals);
        if(maxAmount.lt(amt)) {
            setSendAmtError('insufficient funds');
            return;
        }
      }
    
      const getMaxAmount = async () => {
        const feeInfo:any = await estimateTxnFee(provider);
        if(!feeInfo) {
            console.error('Error estimating txn fee');
            return;
        }
        const gasUsageLimit = currentAsset?.symbol==='ETH' ? BigNumber.from(21000) : BigNumber.from(210000);
        const { estimatedFeePerGas, maxFeePerGas } = feeInfo[feeAmount.setting];
        const fee = {
            estimate: estimatedFeePerGas.mul(gasUsageLimit),
            max: maxFeePerGas.mul(gasUsageLimit),
            setting: 'medium'
        };
        setFeeAmount(fee);
        if(accountBalance.lte(fee.max)) return BigNumber.from('0');
        const maxAmt = accountBalance.sub(fee.max);
        return maxAmt;
      };
    
      const updateAmountToMax = async () => {
        const maxAmt = await getMaxAmount();
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
                    disabled={sendAmtError || !Number(amount) ? true : false}
                    sx={{textTransform: 'none', cursor:'pointer'}}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default SendTokenOptions;