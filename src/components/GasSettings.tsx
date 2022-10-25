import React, { useEffect, useState } from 'react';
import { Box, Button ,IconButton, FormControl, FormControlLabel, RadioGroup, Radio, List, ListItem, TextField  } from '@mui/material';
import * as storage from '../services/storage';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { getAccountBackgroundColor } from '../utils/color';
import { BigNumber } from 'ethers';
import { estimateTxnFee, formatInUnits, parseFromUnits } from '../utils/ethers';
import { createStyles, makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme: any) =>
    createStyles({
      smallRadioButton: {
        "& svg": {
          width: "15px",
          height: "15px"
        }
      }
    })
);


function GasSettings(props: any) {

    const classes = useStyles();

    const { 
        provider, 
        currentAccount, 
        currentAsset, 
        feeAmount, 
        gasSetting, 
        gasLimit,
        maxPriorityFee,
        maxFee,
        gasLimitError,
        maxPriorityFeeError,
        maxFeeError,
        handleGasSettingChange, 
        handleGasLimitChange,
        handleMaxPriorityFeeChange,
        handleMaxFeeChange,
        handleSaveGasSettings,
        handleCloseGasSettings,
        txnTimeMsg 
    } = props;

    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [estimatedFeePreview, setEstimatedFeePreview] =  useState(feeAmount.estimate);
    const [maxFeePreview, setMaxFeePreview] = useState(feeAmount.max);
   
    useEffect(() => {
        setEstimatedFeePreview(feeAmount.estimate);
    }, [feeAmount.estimate]);

    useEffect(() => {
        setMaxFeePreview(feeAmount.max);
    }, [feeAmount.max])

    // useEffect(() => {
    //     setGasLimit(feeAmount.gasLimit)
    // }, [feeAmount.gasLimit, gasSetting, feeAmount.setting]);

    // useEffect(() => {
    //     setMaxPriorityFee(formatInUnits(feeAmount.maxPriorityFeePerGas,'gwei'));
    // }, [feeAmount.maxPriorityFeePerGas._hex, gasSetting, feeAmount.setting]);

    // useEffect(() => {
    //     setMaxFee(formatInUnits(feeAmount.maxFeePerGas, 'gwei'));
    // }, [feeAmount.maxFeePerGas._hex, gasSetting, feeAmount.setting]);


    const formatFeeAmt = (feeAmt: BigNumber) => {
        /**
         * present implementation supports only Rinkeby and Ethereum Mainnet and Ether currency
         * so fee is always in ETH and is the defaultAsset and the only assets
         * If supporting option to use multiple networks and send multiple tokens
         * consider having a defaultAsset variable and adding 
         */
        if(!feeAmt) return '0 ETH';
        const formattedFeeAmt = formatInUnits(feeAmt, 18);
        return `${Number(formattedFeeAmt).toFixed(8)} ETH`;
    }
    

    const handleShowAdvancedSettings = (e: any) => {
        e.preventDefault();
        setShowAdvancedSettings(!showAdvancedSettings);
    }

    return (
      <div style={{ display: 'flex', minWidth: '350px', flexDirection: 'column', justifyContent:'space-around', alignItems:'center', marginTop: '20px', width:'100%'}}>   
         <Box component="div" sx={{ width: '100%', display: 'flex', alignItems:'center', justifyContent: 'space-between' }}>
            <div style={{ width: '100%', fontSize:'18px', fontWeight: 'bold'}}>Edit Priority</div>
            <div>
                <IconButton 
                    color="primary" 
                    aria-label="add to shopping cart"
                    onClick={handleCloseGasSettings}
                    sx={{ textTransform: 'none', cursor:'pointer', padding:'0', margin: '0'}}
                >
                    <CloseIcon />
                </IconButton>    
            </div>
         </Box>
         <Box sx={{fontSize:'28px', fontWeight: '900', height:'50px', marginTop: '25px'}}>
            {formatFeeAmt(estimatedFeePreview)}
         </Box>
            <Box sx={{ fontSize:'16px', fontWeight: '900'}} > 
                Max fee: 
                <span style={{color: '#555'}}>({formatFeeAmt(maxFeePreview)})</span>
            </Box>
            <Box>
                {txnTimeMsg}
            </Box> 

            <Box component="div" sx={{marginTop: '20px'}}>
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="demo-form-control-label-placement"
                    name="gas_setting"
                    value={gasSetting}
                    onChange={handleGasSettingChange}
                >
                    <FormControlLabel
                        value="slow"
                        control={<Radio />}
                        label="slow"
                        labelPlacement="bottom"
                        className={classes.smallRadioButton}
                    />
                       
                    <FormControlLabel
                        value="medium"
                        control={<Radio />}
                        label="medium"
                        labelPlacement="bottom"
                        className={classes.smallRadioButton}
                    />

                    <FormControlLabel
                        value="fast"
                        control={<Radio />}
                        label="fast"
                        labelPlacement="bottom"
                        className={classes.smallRadioButton}
                    />
                </RadioGroup>
            </FormControl>
            </Box>
                
            <Box sx={{ marginTop: '5px' }}>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleShowAdvancedSettings}
                    sx={{textTransform: 'none'}}
                >
                    Advanced Options
                    {showAdvancedSettings ?
                        <ArrowDropUpIcon/> :
                        <ArrowDropDownIcon />
                    }
                </Button>
            </Box>

            {showAdvancedSettings &&
            <Box component="div" sx={{ width: '100%', maxHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent:'space-around', alignItems:'center', marginTop: '20px'}}>
                <List>
                    <ListItem sx={{width: '100%'}}>
                        <TextField 
                            id="outlined-basic" 
                            label="Gas Limit" 
                            variant="outlined" 
                            type="number"
                            value={gasLimit}
                            onChange={handleGasLimitChange}
                            size="small"
                            sx={{minWidth: '250px' }}

                        />
                    </ListItem> 
                    {gasLimitError && <ListItem>
                        <span style={{color: 'red', marginTop: '0px'}}> {gasLimitError} </span>
                    </ListItem>}
                    <ListItem sx={{width: '100%'}}>
                        <TextField 
                            id="outlined-basic" 
                            label="Max Priority Fee (GWEI)" 
                            variant="outlined" 
                            type="number" 
                            value={maxPriorityFee}
                            onChange={handleMaxPriorityFeeChange}
                            size="small"
                            sx={{minWidth: '250px'}}
                        />
                    </ListItem> 
                    {maxPriorityFeeError && <ListItem>
                        <span style={{color: 'red', marginTop: '0px'}}> {maxPriorityFeeError} </span>
                    </ListItem>}
                    <ListItem sx={{width: '100%'}}>
                        <TextField 
                            id="outlined-basic" 
                            label="Max Fee (GWEI)" 
                            variant="outlined" 
                            type="number"
                            value={maxFee}
                            onChange={handleMaxFeeChange}
                            size="small"
                            sx={{minWidth: '250px'}}

                        />
                    </ListItem> 
                    {maxFeeError && <ListItem>
                        <span style={{color: 'red', marginTop: '0px'}}> {maxFeeError} </span>
                    </ListItem>}
                </List>
    
                <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '5px'}}>
                    <Button 
                        size="medium" 
                        color="primary" 
                        variant="contained"
                        onClick={handleSaveGasSettings}
                        sx={{textTransform: 'none', cursor:'pointer', marginLeft: '20px', marginRight: '20px'}}
                    >
                        Save
                    </Button>
                </div>
            </Box>}
            
      </div>
    );
}

export default GasSettings;