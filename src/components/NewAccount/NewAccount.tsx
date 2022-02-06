import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button,  Typography, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { decryptData } from '../../utils/crypto';
import { createAccountFromHDRootNode, createHDRootNodeFromMnemonic, createHDRootNodefromRandom} from '../../utils/ethers';
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

function NewAccountModal(props: any) {
  const {open, setOpen,  accounts, setCurrentAccount, setCurrentIndex, setAccounts } = props;
  const [error, setError] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setError('');
    setOpen(false);
    if(!accountName) setAccountName(`Account ${accounts.length+1}`);
  }

  const [accountName, setAccountName] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setAccountName(e.target.value);

  useEffect(() => {
    setAccountName(`Account ${accounts.length+1}`);
  }, [accounts.length])


  const createAccountAndSetAsCurrent = (e: any) => {
      e.preventDefault();
      if(!accountName) {
        setError('account name can\'t be empty');
        return;
      }

      //create account
      const mnemonic = storage.getMnemonic();
      const rootNode = createHDRootNodeFromMnemonic(mnemonic, '');
      const newAcctIndex = storage.getLastPathIndex() + 1;
      const newAccount = createAccountFromHDRootNode(rootNode, newAcctIndex);

      //check duplicates
      const existingAcc = accounts.find((account: any) => account.address===newAccount.address);
      if(existingAcc) {
        setError('account already exists');
        return;
      }

      //store account info to storage
      storage.setAccountName(accountName, newAccount.address);
      storage.setAccount(newAccount);
      storage.setAccountIndex(newAcctIndex);
      storage.setLastPathIndex(newAcctIndex);
      
     //set state variables 
      setCurrentIndex(newAcctIndex);
      const currentAcc = storage.getAccount(newAcctIndex);
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
            Account Name
          </Typography>
          <TextField 
            id="filled-basic" 
            label="" 
            variant="filled" 
            value={accountName}
            onChange={handleChange}
          />
          {error && <div style={{color: 'red', marginTop: '5px'}}>{error}</div>}
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '15px'}}>       
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
                onClick={createAccountAndSetAsCurrent}
            >
                Create
            </Button>
        </div>
        </Box>
       
        </>
      </Modal>
    </div>
  );
}

export default NewAccountModal;