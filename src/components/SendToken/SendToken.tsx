import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, TextField, Modal } from '@mui/material';
import * as storage from '../../services/storage';
import AddressBookSelect from '../AddressBookSelect';
import SendTokenOptions from '../SendTokenOptions';
import ViewTxnSummary from '../ViewTxnSummary';
import {  isValidEthAddress, estimateTxnFee  } from '../../utils/ethers';
import ethIcon from '../../assets/img/eth_icon.svg';
import GoBackIcon from '@mui/icons-material/ArrowBackIos';
import { BigNumber } from 'ethers';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
//   width: 600,
  minHeight: 150,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};


function SendTokenModal(props: any) {

  const {open, setOpen, provider, currentAccount, chainID,  accounts, accountBalance, setAccountBalance } = props;

  const [assets, setAssets] = useState([{
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    icon: ethIcon
  }]);

  const [currentAsset, setCurrentAsset] = useState({
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    icon: ethIcon
  });
  const [displayUserAccounts, setDisplayUserAccounts] = useState(false);
  const [displaySendOptions, setDisplaySendOptions] = useState(false);
  const [displayTxnSummary, setDisplayTxnSummary] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [amount, setAmount] = useState('');
  const [recepientAddressError, setRecepientAddressError] = useState(''); 

  const [feeAmount, setFeeAmount] = useState({
    estimate: BigNumber.from('0'),
    max: BigNumber.from(0),
    setting: 'medium'
  });
  
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setRecepientAddressError('');
    setDisplayUserAccounts(false);
    setDisplaySendOptions(false);
    setDisplayTxnSummary(false);
    setOpen(false);
  }

  const handleDisplayUserAccounts = (e: any) => setDisplayUserAccounts(!displayUserAccounts);

  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecepientAddressError('');
    setReceiverName('');
    const addr = e.target.value;
    setReceiverAddress(addr);
    if(isValidEthAddress(addr)) 
        setDisplaySendOptions(true);
    else {
        if(addr) setRecepientAddressError('invalid address');
        setDisplaySendOptions(false);
    }      
  }

  
  const handleTransferBetweenAccounts = (address: string, index: number) => {
    setRecepientAddressError('');
    setReceiverName('');
    setDisplaySendOptions(false);
    const receiverName = storage.getAccountName(address) ?? `Account ${index+1}`;
    setReceiverName(receiverName);
    setReceiverAddress(address);
    setDisplaySendOptions(true);   
  }

  const handleCancelSend = (e: any) => {
      e.preventDefault();
      setRecepientAddressError('');
      setAmount('');
      setDisplaySendOptions(false);
      setDisplayTxnSummary(false);
      setOpen(false);
  }

  const handleNext = (e: any) => {
      setDisplaySendOptions(false);
      setDisplayTxnSummary(true);
  }
  const goBackToSendOptions = (e: any) => {
    setDisplaySendOptions(true);
    setDisplayTxnSummary(false);
  }

  const handleConfirm = (e: any) => {
      console.log('Trigerred');
  }
  useEffect(() => {
    if(!displayTxnSummary) return;
    const interval = setInterval(async () => {
        if(!provider) return;
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
    }, 4000);

    return () => {
        clearInterval(interval);
    }
  }, [displayTxnSummary])
  
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <>
        <Box sx={style}>     
            {!displayTxnSummary &&
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-around', alignItems:'center'}}>
                <Typography variant="body2" color="text.primary" sx={{fontWeight: 'bold', fontSize: '16px', marginBottom: '20px'}} >Send To</Typography>
                <Button 
                    size="small" 
                    color="primary" 
                    variant="text"
                    onClick={handleClose}
                    sx={{marginRight: '20px', postition: 'relative', top: '-45px', left:'200px', textTransform: 'none'}}
                >
                    Cancel
                </Button>
                <TextField 
                    id="filled-basic" 
                    label={receiverName ?? "Address"}
                    variant="filled" 
                    type="search"
                    value={receiverAddress}
                    onChange={handleReceiverChange}
                    sx={{minWidth: '430px'}}
                />
            </div>}
            {displayTxnSummary &&
            <div style={{ display: 'flex', width:'100%', justifyContent:'flex-start', alignItems:'center'}}>
                <Button 
                    size="medium" 
                    color="primary" 
                    variant="text"
                    onClick={goBackToSendOptions}
                >
                    <GoBackIcon sx={{width: 18, height: 18}} />
                        Back
                </Button>
            </div>}

            {recepientAddressError && <div style={{color: 'red', marginTop:'10px'}}>{recepientAddressError}</div>}

            {!displaySendOptions && !displayTxnSummary && 
            <AddressBookSelect
                accounts={accounts}
                displayUserAccounts={displayUserAccounts}
                handleDisplayUserAccounts={handleDisplayUserAccounts}
                handleTransferBetweenAccounts={handleTransferBetweenAccounts}
            />} 

            {displaySendOptions && !displayTxnSummary &&
            <SendTokenOptions 
                chainID={chainID} 
                provider={provider}
                accountBalance={accountBalance} 
                setAccountBalance={setAccountBalance}  
                amount={amount}
                setAmount={setAmount}
                feeAmount={feeAmount}
                setFeeAmount={setFeeAmount}
                handleCancelSend={handleCancelSend}
                handleNext={handleNext}
                assets={assets}
                setAssets={setAssets}
                currentAsset={currentAsset}
                setCurrentAsset={setCurrentAsset}
            />} 

            {!displaySendOptions && displayTxnSummary &&
             <ViewTxnSummary
                currentAccount={currentAccount} 
                currentAsset={currentAsset} 
                receiverAddress={receiverAddress}
                amount={amount}
                feeAmount={feeAmount}
                handleCancelSend={handleCancelSend}
                handleConfirm={handleConfirm}
             />
            } 
        </Box>
      </>
      </Modal>
    </div>
  );
}

export default SendTokenModal;