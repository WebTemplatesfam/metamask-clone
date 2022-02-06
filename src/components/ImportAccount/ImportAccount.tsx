import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button,  Typography, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { decryptData } from '../../utils/crypto';
import { createAccountFromHDRootNode, createAccountFromPrivateKey, createHDRootNodeFromMnemonic, createHDRootNodefromRandom} from '../../utils/ethers';
import * as storage from '../../services/storage';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  minHeight: 150,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column'
};

function ImportAccountModal(props: any) {
  const {open, setOpen, setCurrentAccount, setCurrentIndex, accounts, setAccounts } = props;
  const [error, setError] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setError('');
    setOpen(false);
  }

  const [privateKey, setPrivateKey] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(e.target.value);

  const importAccountAndSetAsCurrent = (e: any) => {
      e.preventDefault();
      //create account
      const importedAccount = createAccountFromPrivateKey(privateKey);
      // console.log(importedAccount);
      const importedAccIndex = storage.getLastWalletIndex() + 1;
      // console.log(importedAccIndex);

      // check duplicates
      //check duplicates
      const existingAcc = accounts.find((account: any) => account.address===importedAccount.address);
      if(existingAcc) {
        setError('account already exists');
        return;
      }

      if(!importedAccount?.address) {
        setError('account address not found');
        return;
      }
      //store account info to storage
      storage.setAccountName(`Account ${importedAccIndex+1}`, importedAccount.address);
      storage.setAccountIndex(importedAccIndex);
      storage.setAccount(importedAccount);
      

      //set state variables 
      setCurrentIndex(importedAccIndex);
      const currentAcc = storage.getAccount(importedAccIndex);
      setCurrentAccount(currentAcc);
      const accts = storage.getAccounts();
      const accountsInfo = accts.map((acct: any) => { 
          const account = decryptData(acct);
          return {
              address: account?.address,
              name: storage.getAccountName(account?.address)
          }
      });
      setAccounts(accountsInfo);
      setPrivateKey('');
      handleClose();       
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Private Key
          </Typography>
          <TextField 
            id="filled-basic" 
            type="password"
            label="" 
            variant="filled" 
            value={privateKey}
            onChange={handleChange}
          />
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '15px'}}>
           {error && <div style={{color: 'red', marginBottom: '5px'}}>{error}</div>}
            <Button 
                size="medium" 
                color="primary" 
                variant="contained"
                onClick={handleClose}
            >
                Cancel
            </Button>
            <Button 
                size="medium" 
                color="primary" 
                variant="contained"
                onClick={importAccountAndSetAsCurrent}
            >
                Import
            </Button>
        </div>
        </Box>
       
        </>
      </Modal>
    </div>
  );
}

export default ImportAccountModal;