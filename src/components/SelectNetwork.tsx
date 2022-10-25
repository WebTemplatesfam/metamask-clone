import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getNetworkByChainID } from '../utils/ethers';
import {  NETWORKS, NETWORK_CHAIN_ID } from '../utils/constants';


function SelectNetwork(props: any) {

    /* { chainID, setChainID, setNetwork }  = props */
    const { chainID, setChainID } = props;
    const handleChainIDChange = (e: any) => {
        e.preventDefault();
        setChainID(e.target.value);
    }

    return (
        <FormControl fullWidth sx={{width: 220}}>
            <InputLabel id="demo-simple-select-label">Network</InputLabel>
            <Select 
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.chainID}
                defaultValue={NETWORK_CHAIN_ID.GOERLI}
                label="Network"
                onChange={handleChainIDChange}
                sx={{height: 42}}
            >   
                {NETWORKS.filter(ntwrk => ntwrk.chainID!==props.chainID).map(ntwrk => 
                    <MenuItem 
                        key={ntwrk.name+ntwrk.chainID}
                        value={ntwrk.chainID}
                    > 
                        {ntwrk.name} 
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    );
}

export default SelectNetwork;