import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button,  Typography, TextField, IconButton, Tooltip } from '@mui/material';
import Modal from '@mui/material/Modal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import { decryptData, SHA256Hash } from '../../utils/crypto';
import { createAccountFromHDRootNode, createAccountFromPrivateKey, createHDRootNodeFromMnemonic, createHDRootNodefromRandom} from '../../utils/ethers';
import * as storage from '../../services/storage';
import { NETWORKS } from '../../utils/constants';

import QRCode from 'react-qr-code';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  minHeight: 150,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

function ViewAccountModal(props: any) {

  const {open, setOpen, currentAccount, chainID } = props;
  const networkInfo = NETWORKS.find(ntwrk => ntwrk.chainID===chainID);
  const [error, setError] = useState('');
  const [viewInfo, setViewInfo] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setError('');
    setPassword('');
    setViewInfo(false);
    setOpen(false);
  }

  const [password, setPassword] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleCopyAddress = async (e: any) => {
    e.preventDefault();
    await navigator.clipboard.writeText(currentAccount.address);
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 1500)
  }

  const confirmPasswordAndViewAccount = (e: any) => {
      e.preventDefault();
      setError('');
      const hash = SHA256Hash(password);
      const pwdHash = storage.getPasswordHash();
      if(hash!==pwdHash) {
        setError('incorrect password');
        return;
      } 
      setViewInfo(true);       
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
        <Typography gutterBottom variant="h6" component="div" sx={{marginBottom: '15px'}}>
          {storage.getAccountName(currentAccount?.address)}
        </Typography>
        <QRCode value={currentAccount?.address} size={128} />
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginTop: '20px'}}>
          <Typography gutterBottom variant="body2" component="div" sx={{fontWeight: '500', marginTop: '10px'}}>
            {currentAccount?.address}
          </Typography>
          <Tooltip title={!addressCopied ? "Copy Address" : "Copied"}>
            <IconButton aria-label="settings" onClick={handleCopyAddress}>
                <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View on Etherscan">
            <IconButton aria-label="settings" href={`${networkInfo?.explorer}/address/${currentAccount?.address}`} target="_blank">
                <LinkIcon />
            </IconButton>
          </Tooltip>
        </div>
          {!viewInfo &&
          <>
            <Typography id="modal-modal-title" variant="body2" component="h2" sx={{ marginTop: '15px', fontWeight: 'bold'}}>
              Confirm Password
            </Typography>
            <TextField 
              id="outlined-basic" 
              type="password"
              label="" 
              variant="outlined" 
              value={password}
              onChange={handleChange}
            />
          </>}
          {error && <div style={{color: 'red', marginTop:'10px'}}>{error}</div>}
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '15px', marginBottom: '30px'}}>
            <Button 
                size="medium" 
                color="primary" 
                variant="contained"
                onClick={handleClose}
                sx={{marginRight: '20px'}}
            >
                {!viewInfo ? 'Cancel' : 'Close'}
            </Button>
            {!viewInfo &&
              <Button 
                size="medium" 
                color="primary" 
                variant="contained"
                onClick={confirmPasswordAndViewAccount}
            >
                View Account
            </Button>
            } 
        </div>
        {viewInfo &&
        <>
          <Typography gutterBottom variant="body2" component="div" sx={{fontWeight:'bold', marginBottom: '0px'}}>
            Public key
          </Typography>
          <Typography gutterBottom variant="body2" component="div">
            {currentAccount?.publicKey}
          </Typography>
          <Typography gutterBottom variant="body2" component="div" sx={{fontWeight: 'bold', marginBottom: '0px', marginTop: '15px'}}>
            Private key
          </Typography>
          <Typography gutterBottom variant="body2" component="div">
            {currentAccount?.privateKey}
          </Typography>
        </>}
        </Box>
       
      </>
      </Modal>
    </div>
  );
}

export default ViewAccountModal;