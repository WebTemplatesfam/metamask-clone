import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, TextField, Modal } from '@mui/material';
import * as storage from '../../services/storage';
import AddressBookSelect from '../AddressBookSelect';
import SendTokenOptions from '../SendTokenOptions';
import ViewTxnSummary from '../ViewTxnSummary';
import GasSettings from '../GasSettings';
import {  isValidEthAddress, estimateTxnFee, estimateBaseGasFee, formatInUnits, parseFromUnits  } from '../../utils/ethers';
import ethIcon from '../../assets/img/eth_icon.svg';
import GoBackIcon from '@mui/icons-material/ArrowBackIos';
import { BigNumber, ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { clear } from 'console';

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
  const [displayGasSettings, setDisplayGasSettings] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [amount, setAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState(BigNumber.from('0'));
  const [recepientAddressError, setRecepientAddressError] = useState(''); 
  const [feeAmount, setFeeAmount] = useState({
    gasLimit: currentAsset.symbol==='ETH' ? 21000 : 210000,
    baseFeePerGas: BigNumber.from('0'),
    maxPriorityFeePerGas: BigNumber.from('0'),
    maxFeePerGas: BigNumber.from('0'),
    estimate: BigNumber.from('0'),
    max: BigNumber.from(0),
    setting: 'medium',
  });
  const [gasSetting, setGasSetting] = useState('medium');
  const [areCustomGasParams, setAreCustomGasParams] =useState(false);
  const [txnTimeMsg, setTxnTimeMsg] = useState(<span style={{color: 'green'}}>{'Likely in < 30 seconds'}</span>);

  const [gasLimit, setGasLimit] = useState("21000");
  const [maxPriorityFee, setMaxPriorityFee]=useState("0");
  const [maxFee, setMaxFee]=useState("0");

  const [gasLimitError, setGasLimitError]=useState('');
  const [maxPriorityFeeError, setMaxPriorityFeeError]=useState('');
  const [maxFeeError, setMaxFeeError]=useState('');

  
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
      setReceiverAddress('');
      setAmount('');
      setDisplaySendOptions(false);
      setDisplayTxnSummary(false);
      setOpen(false);
  }

  const handleNext = (e: any) => {
      e.preventDefault();
      setDisplaySendOptions(false);
      setDisplayTxnSummary(true);
  }
  const goBackToSendOptions = (e: any) => {
    e.preventDefault();
    setDisplaySendOptions(true);
    setDisplayTxnSummary(false);
  }

  const handleEditGasSettings = (e: any) => {
    e.preventDefault();
    setDisplayGasSettings(true);
    setDisplayTxnSummary(false);
    setDisplaySendOptions(false);
  }

  const handleGasSettingChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setGasSetting(e.target.value);
    const txnTimeMessage = e.target.value==='slow' ? <span style={{color: 'red'}}>{'Maybe in > 30 seconds'}</span> :
            (gasSetting==='medium' ? 
              <span style={{color: 'green'}}>{'Likely in < 15 seconds'}</span> : 
              <span style={{color: 'green'}}>{ 'Likely in < 30 seconds'}</span> 
            );
    setTxnTimeMsg(txnTimeMessage);
    const baseFee = feeAmount.baseFeePerGas;
    const feeInfo: any = estimateTxnFee(baseFee);
    if(areCustomGasParams) {
      /*
      const maxPriorityFeePerGas = parseFromUnits(maxPriorityFee, 'gwei');
      const maxFeePerGas = parseFromUnits(maxFee, 'gwei');
      const estimatedFeePerGas = baseFee.add(maxPriorityFee);
      */
      const maxPriorityFeePerGas = parseFromUnits(maxPriorityFee, 'gwei');
      const maxFeePerGas = parseFromUnits(maxFee, 'gwei');
      const estimatedFeePerGas = feeAmount.baseFeePerGas.add(maxPriorityFee);
      /*
      setFeeAmount(prev => ({
        ...prev,
        maxPriorityFeePerGas,
        maxFeePerGas,
        estimate: estimatedFeePerGas.mul(gasLimit),
        max: maxFeePerGas.mul(gasLimit),
        setting: gasSetting
      }));
      console.log(gasSetting);
      console.log(feeAmount);
    */ 
      setFeeAmount(prev => ({
        gasLimit: currentAsset.symbol==='ETH' ? 21000 : 210000,
        baseFeePerGas: prev.baseFeePerGas,
        maxPriorityFeePerGas,
        maxFeePerGas,
        estimate: estimatedFeePerGas.mul(gasLimit),
        max: maxFeePerGas.mul(gasLimit),
        setting: 'medium',
      }));
    }
    else {
      const { baseFeePerGas, maxPriorityFeePerGas, estimatedFeePerGas, maxFeePerGas} = feeInfo[gasSetting];
      setMaxPriorityFee(formatInUnits(maxPriorityFeePerGas, 'gwei'));
      setMaxFee(formatInUnits(maxPriorityFeePerGas, 'gwei'));
      setFeeAmount(prev => ({
        ...prev,
        baseFeePerGas,
        maxPriorityFeePerGas,
        maxFeePerGas,
        estimate: estimatedFeePerGas.mul(gasLimit),
        max: maxFeePerGas.mul(gasLimit),
        setting: gasSetting
      }));
    }
    const maxAmt = await getMaxAmount(feeAmount);
    if(!maxAmt) setMaxAmount(BigNumber.from('0'));
  }


  const handleConfirm = (e: any) => {
      console.log('Trigerred');
  }

  const getMaxAmount = async (feeAmount: any) => {
    if(!feeAmount) {
        console.error('Error estimating txn fee');
        return;
    }
    if(accountBalance.lte(feeAmount.max)) return BigNumber.from('0');
    const maxAmt = accountBalance.sub(feeAmount.max);
    return maxAmt;
  };

  const _updateFeeAmtAndMaxAmt = async (provider: ethers.providers.JsonRpcProvider) => {
    try {
      const baseFeePerGas = await estimateBaseGasFee(provider);
      const feeInfo: any = await estimateTxnFee(baseFeePerGas);
      let feeAmt: any = {};
      if(!feeInfo) {
          console.error('Error estimating txn fee');
          return;
      }
      const gasUsageLimit = currentAsset?.symbol==='ETH' ? 21000 : 210000;
      const { estimatedFeePerGas, maxPriorityFeePerGas, maxFeePerGas } = feeInfo[gasSetting];
      if(areCustomGasParams) {
        console.log(feeAmount);
        const gasLimit=feeAmount.gasLimit;
        const maxPriorityFee=feeAmount.maxPriorityFeePerGas;
        const maxFee = feeAmount.maxFeePerGas;
        feeAmt = {
          ...feeAmount,
          baseFeePerGas, 
          estimatedFeePerGas: baseFeePerGas.add(maxPriorityFee).mul(gasLimit),
          maxFeePerGas: baseFeePerGas.add(maxFee).mul(gasLimit)
        };
        setFeeAmount(prev => ({  
          ...prev,
          baseFeePerGas, 
          estimatedFeePerGas: baseFeePerGas.add(maxPriorityFee).mul(gasLimit),
          maxFeePerGas: baseFeePerGas.add(maxFee).mul(gasLimit)
        }))
      } else {
        feeAmt = {
          gasLimit: gasUsageLimit,
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: maxFeePerGas,
          estimate: estimatedFeePerGas.mul(gasUsageLimit),
          max: maxFeePerGas.mul(gasUsageLimit),
          setting: feeAmount.setting
        };
        setFeeAmount(feeAmt);
        const maxAmt = await getMaxAmount(feeAmt);
        if(!maxAmt) setMaxAmount(BigNumber.from('0'));
        setMaxAmount(maxAmt);
      }
    }
    catch(error) {
      console.log(error);
      console.error('Something went wrong with updating txn fee and max amount ')
    }
  }

  useEffect(() => {
    if(!provider) return;
    _updateFeeAmtAndMaxAmt(provider);
  }, []);

  /*
  fee updated on every new block creation
  useEffect(() => {
      if(!provider) return;
      provider.on('block', async () => {
        _updateFeeAmtAndMaxAmt(provider);
      });

    return () => {
        provider.off('block', () => console.log('Stopped listening to feeChanges'));
    }
  }, [displaySendOptions ,displayTxnSummary, gasSetting, areCustomGasParams]);
  */

  /* fee updated every 5 secs */
  useEffect(() => {
    if(!provider) return;
    if(!displaySendOptions && !displayTxnSummary && !displayGasSettings ) return;
    const feeChangeInterval = setInterval(() => {
      _updateFeeAmtAndMaxAmt(provider);
    }, 5000);

  return () => {
    clearInterval(feeChangeInterval);
  }
}, [displaySendOptions,displayTxnSummary, gasSetting, areCustomGasParams]);

const handleGasLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setGasLimitError('');
  setGasLimit(e.target.value);
  if(isNaN(Number(e.target.value))) {
      setMaxPriorityFeeError('invalid number');
      return;
  }
  setMaxPriorityFeeError(e.target.value);
}

const handleMaxPriorityFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setMaxPriorityFeeError('');
  if(isNaN(Number(e.target.value))) {
      setMaxPriorityFeeError('invalid number');
      return;
  }
  setMaxPriorityFee(e.target.value);
}
// const handleMaxFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => setMaxFee(e.target.value);

  const handleMaxFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFeeError('');
    if(isNaN(Number(e.target.value))) {
        setMaxFeeError('invalid number');
        return;
    }
    console.log(e.target.value);
    setMaxFee(e.target.value);
  }

  const handleSaveGasSettings = async (e: any) => {
    
  }

  const handleCloseGasSettings = (e: any) => {
    e.preventDefault();
    setGasLimit(feeAmount.gasLimit.toString());
    setMaxPriorityFee(formatInUnits(feeAmount.maxPriorityFeePerGas,'gwei'));
    setMaxFee(formatInUnits(feeAmount.maxFeePerGas, 'gwei'));
    setAreCustomGasParams(false);
    setDisplayGasSettings(false);
    setDisplayTxnSummary(true);
  }

  
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
            {!displayTxnSummary && !displayGasSettings &&
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-around', alignItems:'center'}}>
                <Typography variant="body2" color="text.primary" sx={{fontWeight: 'bold', fontSize: '16px', marginBottom: '20px'}} >Send To</Typography>
                {!displaySendOptions &&<Button 
                    size="small" 
                    color="primary" 
                    variant="text"
                    onClick={handleCancelSend}
                    sx={{marginRight: '20px', postition: 'relative', top: '-45px', left:'200px', textTransform: 'none'}}
                >
                    Cancel
                </Button>
                } 
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
            {displayTxnSummary && !displayGasSettings &&
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

            {!displaySendOptions && !displayTxnSummary && !displayGasSettings &&
            <AddressBookSelect
                accounts={accounts}
                displayUserAccounts={displayUserAccounts}
                handleDisplayUserAccounts={handleDisplayUserAccounts}
                handleTransferBetweenAccounts={handleTransferBetweenAccounts}
            />} 

            {displaySendOptions && !displayTxnSummary && !displayGasSettings &&
            <SendTokenOptions 
                chainID={chainID} 
                provider={provider}
                accountBalance={accountBalance} 
                setAccountBalance={setAccountBalance}  
                amount={amount}
                setAmount={setAmount}
                feeAmount={feeAmount}
                setFeeAmount={setFeeAmount}
                maxAmount={maxAmount}
                getMaxAmount={getMaxAmount}
                setMaxAmount={setMaxAmount}
                handleCancelSend={handleCancelSend}
                handleNext={handleNext}
                assets={assets}
                setAssets={setAssets}
                currentAsset={currentAsset}
                setCurrentAsset={setCurrentAsset}
            />} 

            {!displaySendOptions && displayTxnSummary && !displayGasSettings &&
             <ViewTxnSummary
                currentAccount={currentAccount} 
                currentAsset={currentAsset} 
                receiverAddress={receiverAddress}
                amount={amount}
                feeAmount={feeAmount}
                maxAmount={maxAmount}
                getMaxAmount={getMaxAmount}
                setMaxAmount={setMaxAmount}
                handleCancelSend={handleCancelSend}
                handleConfirm={handleConfirm}
                handleEditGasSettings={handleEditGasSettings}
                txnTimeMsg={txnTimeMsg}
                gasSetting={gasSetting}
             />
            } 

            {!displaySendOptions && !displayTxnSummary && displayGasSettings &&
             <GasSettings
                provider={provider}
                feeAmount={feeAmount}
                handleGasSettingChange={handleGasSettingChange}
                setDisplayGasSettings={setDisplayGasSettings}
                setDisplayTxnSummary={setDisplayTxnSummary}
                setAreCustomGasParams={setAreCustomGasParams}
                txnTimeMsg={txnTimeMsg}
                gasLimit={gasLimit}
                maxPriorityFee={maxPriorityFee}
                maxFee={maxFee}
                handleGasLimitChange={handleGasLimitChange}
                handleMaxPriorityFeeChange={handleMaxPriorityFeeChange}
                handleMaxFeeChange={handleMaxFeeChange}
                handleCloseGasSettings={handleCloseGasSettings}
                handleSaveGasSettings={handleSaveGasSettings}
                gasLimitError={gasLimitError}
                maxPriorityFeeError={maxPriorityFeeError}
                maxFeeError={maxFeeError}
             />
            } 
        </Box>
      </>
      </Modal>
    </div>
  );
}

export default SendTokenModal;