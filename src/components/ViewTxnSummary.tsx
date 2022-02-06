import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Card, Divider  } from '@mui/material';
import * as storage from '../services/storage';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getAccountBackgroundColor } from '../utils/color';
import { BigNumber } from 'ethers';
import { formatInUnits, parseFromUnits } from '../utils/ethers';


const accountStyles = (accountAddress: string) => {
    const styles: any = {
        width: '32px',
        height:'32px',
        borderRadius: '50%',
        padding: '4px',
        backgroundColor: getAccountBackgroundColor(accountAddress)
    };
    return styles;
};

const formatDisplayAccountAddress = (address: string) => {
    if(!address) return '';
    return `${address.substring(0,4)}...${address.substring(address.length-4)}`
}


function ViewTxnSummary(props: any) {

    const { currentAccount, currentAsset, receiverAddress, amount, feeAmount, handleCancelSend, handleConfirm } = props;
    
    const [displayGasSettings, setDisplayGasSettings] = useState(false);

    const [gasSetting, setGasSetting] = useState('medium');

    const formatFeeAmt = (feeAmt: BigNumber, decimals: number, symbol: string) => {
        if(!feeAmt) return '0 ETH';
        const formattedFeeAmt = formatInUnits(feeAmt, decimals);
        return `${Number(formattedFeeAmt).toFixed(8)} ${symbol}`;
    }
    
    const formatTotalAmt = (amount:string ,feeAmt: BigNumber, decimals: number, symbol: string) => {
        if(!amount) return '0 ETH'; 
        
        if(symbol==='ETH') {
            const amtInBigNum = parseFromUnits(amount, decimals);
            const totalAmtBigNum = amtInBigNum.add(feeAmt);
            const totalAmt = formatInUnits(totalAmtBigNum, decimals);
            console.log(totalAmt);
            return `${Number(totalAmt).toFixed(8)} ETH`;
        }
        else {
            console.log('There');
            const formattedFeeAmt = formatInUnits(feeAmt, decimals);
            return `${amount} ${symbol} + ${Number(formattedFeeAmt).toFixed(8)} ETH`;
        }
    }

    const handleEditGasSettings = () => {
        setDisplayGasSettings(true);
    }


    return (
        <div style={{ display: 'flex',  minWidth: '350px', flexDirection: 'column', justifyContent:'space-around', alignItems:'flex-start', marginTop: '20px', width:'100%'}}>   
        <Card sx={{width: '100%', padding:'5px 10px', textAlign:'center'}}>
              <span style={{marginRight: '25px'}}>
                  <AccountBalanceWalletIcon sx={accountStyles(currentAccount.address)} />
                  <   span style={{marginLeft: '5px'}}>{storage.getAccountName(currentAccount?.address) ?? formatDisplayAccountAddress(currentAccount?.address)}</span>
              </span>

              <span style={{ border: 'solid 1px #999', padding:'2px', borderRadius: '50%'}}>
                  <ArrowForwardIcon />
              </span>

              <span style={{marginLeft: '25px'}}>
                  <AccountBalanceWalletIcon sx={accountStyles(receiverAddress)} />
                  <span style={{marginLeft: '5px'}}>{storage.getAccountName(receiverAddress) ?? formatDisplayAccountAddress(receiverAddress)}</span>
              </span>
        </Card>
        <Card sx={{width: '100%', minHeight: '120px', marginTop: '1px', padding: '5px 10px', backgroundColor: '#eee'}}>
          <Box component="div" sx={{ marginLeft: '10px', marginTop:'10px' }}>
            <Button size="medium" variant="outlined" sx={{textTransform: 'none', cursor:'auto' }}>Sending {currentAsset.symbol}</Button>
          </Box>
          <Box component="div" sx={{ marginLeft: '10px', marginTop:'5px' }}>
              <Typography variant="h4" sx={{color: '#111'}} >{Number(amount).toFixed(8)}</Typography>
          </Box>

        </Card>
        <Card sx={{width: '100%', marginTop: '1px', padding: '5px 10px'}}>
          <div style={{width:'100%', textAlign: 'right', position: 'relative'}}>
              <Button 
                  size="medium" 
                  color="primary" 
                  variant="text"
                  onClick={handleEditGasSettings}
              >
                  Edit
              </Button>
          </div>
          <Box component="div" sx={{ marginTop:'20px', marginBottom:'20px', display:'flex', justifyContent:'space-between', alignItems: 'center' }}>
              <div style={{textAlign: 'left'}}>
                  <div style={{fontSize:'16px', fontWeight: '900', marginBottom: '5px'}}>Estimated gas fee</div>
                  <div style={{color: feeAmount.setting==='low' ? 'red': 'green', fontSize:'12px', fontWeight: '900', padding: '0px 0px'}}>
                      {feeAmount.setting==='low' ? 'Maybe in > 30 seconds':
                       (feeAmount.setting==='medium' ? 'Likely in < 30 seconds' : 'Likely in < 15 seconds')
                      }
                  </div>
              </div>
              <div style={{textAlign: 'right'}}>   
                  <div 
                      style={{fontSize:'16px', fontWeight: '900', marginBottom: '5px'}}
                  >
                      {formatFeeAmt(feeAmount.estimate, currentAsset.decimals, currentAsset.symbol)}
                  </div>
                  <div 
                      style={{color: '#666', fontSize:'12px', fontWeight: '900', padding: '0px 0px'}}
                  > 
                      Max fee: 
                      {formatFeeAmt(feeAmount.max, currentAsset.decimals, currentAsset.symbol)}
                  </div>
              </div>
          </Box>
          <Divider />
          <Box component="div" sx={{ marginTop:'20px', marginBottom:'20px', display:'flex', justifyContent:'space-between', alignItems: 'center' }}>
              
              <div style={{textAlign: 'left'}}>
                  <div style={{fontSize:'16px', fontWeight: '900', marginBottom: '5px'}}>Total</div>
                  <div style={{color: '#666', fontSize:'12px', fontWeight: '900', padding: '0px 0px'}}> Amount + gas fee </div>
              </div>
              <div style={{textAlign: 'right'}}>  
                  <div style={{fontSize:'16px', fontWeight: '900', marginBottom: '5px'}}>
                      {formatTotalAmt(amount, feeAmount.estimate, currentAsset.decimals, currentAsset.symbol)}
                  </div>
                  <div style={{color: '#666', fontSize:'12px', fontWeight: '900', padding: '0px 0px'}}> 
                      Max Amount: 
                      {formatTotalAmt(amount, feeAmount.max, currentAsset.decimals, currentAsset.symbol)}
                  </div>
              </div>
          </Box>
          <Divider />
          <Box component="div" sx={{ marginTop:'10px', marginBottom:'10px', display:'flex', justifyContent:'center', alignItems: 'center' }}>
              <Button 
                  size="large" 
                  color="primary" 
                  variant="outlined"
                  onClick={handleCancelSend}
                  sx={{textTransform: 'none', cursor:'pointer', marginRight: '20px'}}
              >
                  Reject
              </Button>
              <Button 
                  size="large" 
                  color="primary" 
                  variant="contained"
                  onClick={handleConfirm}
                  sx={{textTransform: 'none', cursor:'pointer'}}
              >
                  Confirm
              </Button>
          </Box>
        </Card>
      </div>
    );
}

export default ViewTxnSummary;