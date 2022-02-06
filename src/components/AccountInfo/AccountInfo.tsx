import React, { useEffect, useState } from 'react';
import { Box, Button,  Typography, Card, CardHeader ,CardContent, CardActions, Avatar, IconButton, Tooltip } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import * as storage from '../../services/storage';
import './AccountInfo.css';
import ethIcon from '../../assets/img/eth_icon.svg';
import { getAccountBackgroundColor } from '../../utils/color';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { balanceOf, formatEth } from '../../utils/ethers';


function AccountInfo(props: any) {

    const {  currentAccount, provider, setOpenViewAccountModal, networkInfo, setOpenSendTokenModal, accountBalance, setAccountBalance } = props;

    const accountIndex = storage.getAccountIndex();

    const currentAccountName = currentAccount?.address ? storage.getAccountName(currentAccount.address) : '';
  
    
    const [addressCopied, setAddressCopied] = useState(false);

    const handleCopyAddress = async (e: any) => {
      e.preventDefault();
      await navigator.clipboard.writeText(currentAccount.address);
      setAddressCopied(true);
      setTimeout(() => {
        setAddressCopied(false);
      }, 1500)
    }

    const handleViewAccount =  (e: any) => {
      e.preventDefault();
      setOpenViewAccountModal(true);
    }

    const handleSendToken = (e: any) => {
      e.preventDefault();
      setOpenSendTokenModal(true);
    }

    useEffect(() => {
        initAccountBalance();
    }, [currentAccount?.address]);

    useEffect(() => {
      initAccountBalance();
    }, [provider?.connection?.url]);

    const initAccountBalance = async () => {
      const balance = await balanceOf(provider, currentAccount?.address);
      setAccountBalance(balance);
    }

    return (
        <>
        <Card sx={{ maxWidth: 700, margin: '20px auto 4px auto' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: getAccountBackgroundColor(currentAccount?.address)}} aria-label="recipe">
              <AccountBalanceWalletIcon />
            </Avatar>
          }
          action={
            <>  
            {currentAccount?.isImported && 
              <Box component="div" sx={{ display: 'inline', marginRight: '10px' }}>
                <Tooltip title={"Imported accounts won't be associated with originally created seed phrase and are hence not backed up by it"}>
                  <Button size="small" variant="outlined" sx={{textTransform: 'none', cursor: 'auto !important'}}>Imported</Button>
                </Tooltip>
              </Box>
            }
                <Tooltip title={!addressCopied ? "Copy Address" : "Copied"}>
                    <IconButton aria-label="settings" onClick={handleCopyAddress}>
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="View Info">
                    <IconButton aria-label="settings" onClick={handleViewAccount} >
                        <InfoIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="View on Etherscan">
                <IconButton aria-label="settings"
                  href={`${networkInfo?.explorer}/address/${currentAccount?.address}`} target="_blank"
                >
                    <LinkIcon />
                </IconButton> 
                </Tooltip>
           </>
          }
          title={currentAccountName ? currentAccountName : `Account ${accountIndex+1}`}
          subheader={currentAccount?.address}
        />
        </Card>
        <Card sx={{ maxWidth: 700, margin: '0px auto 4px auto' }}>
        <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img src={ethIcon} alt="ethIcon"  style={{width: '36px', alignSelf: 'center', border:'1px solid #ddd', borderRadius:'50%'}} />
          <Typography variant="h6" color="text.primary" sx={{marginTop: '5px', fontSize: '25px', fontWeight: '400'}}>
              {Number(formatEth(accountBalance)).toFixed(4)} ETH
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{display: 'flex', marginTop:'0px', flexDirection:'column', alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer'}}>
          <Button variant="contained" onClick={handleSendToken}>
            Send
          </Button>
        </CardActions>
        </Card>
      </>
    );
}

export default AccountInfo;

