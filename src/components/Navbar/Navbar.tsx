import React, { useEffect, useState } from 'react';
import LogoDiv from '../LogoDiv/LogoDiv';
import CreateAccountIcon from '@mui/icons-material/Add';
import ImportAccountIcon from '@mui/icons-material/Download';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled, alpha } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import SelectNetwork from '../SelectNetwork';
import { Button,  Avatar, Box } from '@mui/material';
import {Menu, MenuProps, MenuItem, Divider, Tooltip } from '@mui/material';
import { getAccountBackgroundColor } from '../../utils/color';
import * as storage from '../../services/storage';
import './Navbar.css';

const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));


function Navbar(props: any) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { provider, accounts, currentAccount, setCurrentAccount, setCurrentIndex, setOpenNewAccountModal, setOpenImportAccountModal, chainID, setChainID } = props; 

    const accountStyles = (account: any) => {
        const styles: any = {
            width: '32px',
            height:'32px',
            borderRadius: '50%',
            padding: '4px'
        };
        if(account.address===currentAccount.address)
            styles.backgroundColor=getAccountBackgroundColor(account.address);
        return styles;
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelectAccount = (e: any, index: number) => {
      e.preventDefault();
      setCurrentIndex(index);
      const currentAcct = storage.getAccount(index);
      setCurrentAccount(currentAcct);
      storage.setAccountIndex(index);
      handleClose();
    }

    const handleLockWallet = (e: any) => {
      storage.clearLoginPassword();
      window.location.replace("/login");
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCreateAccount = (e: any) => {
        setOpenNewAccountModal(true);
        handleClose();
    }

    const handleImportAccount = (e: any) => {
      setOpenImportAccountModal(true);
      handleClose();
    }


    return (
       <div id="header-div">
           <LogoDiv />
           <div className="nav-items-container">
                <SelectNetwork 
                    chainID={chainID}
                    setChainID={setChainID}
                />

        <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleClick}
      >
            <Avatar sx={{ bgcolor: getAccountBackgroundColor(currentAccount?.address) }} aria-label="recipe">
                <SettingsIcon />
            </Avatar>
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        
      >
        <MenuItem
          onClick={handleClose}
        >
          My Accounts
        </MenuItem> 
        {accounts.map((account: any, index: number) =>
            <MenuItem 
                onClick={e => handleSelectAccount(e, index)} 
                key={account.address+index}
                disableRipple
            > 
                <AccountBalanceWalletIcon sx={accountStyles(account)} />
                <span style={{marginLeft: '5px'}}>{storage.getAccountName(account.address) ? storage.getAccountName(account.address) : `Account ${index+1}`}</span>
                {account?.isImported && 
                <Box component="div" sx={{ display: 'inline', marginLeft: '10px' }}>
                  <Tooltip title={"Imported accounts won't be associated with originally created seed phrase and are hence not backed up by it"}>
                    <Button size="small" variant="outlined" sx={{textTransform: 'none'}}>Imported</Button>
                  </Tooltip>
                </Box>}
            </MenuItem>
           
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleCreateAccount} disableRipple>
            <CreateAccountIcon sx={{width: 32, height: 32}} />
            Create Account
        </MenuItem>
        <MenuItem onClick={handleImportAccount} disableRipple>
            <ImportAccountIcon sx={{width: 32, height: 32}} />
            Import Account
        </MenuItem>
        <MenuItem onClick={handleLockWallet} disableRipple>
            <LockOutlinedIcon sx={{width: 32, height: 32}} />
            Lock
        </MenuItem>
      </StyledMenu>
           </div>
       </div>
    );
}

export default Navbar;