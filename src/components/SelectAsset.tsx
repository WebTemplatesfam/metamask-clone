import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as storage from '../services/storage';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { formatEth } from '../utils/ethers';


function SelectAsset(props: any) {

    const { assets, setAssets, currentAsset, setCurrentAsset, accountBalance, } = props;

    const [error, setError] = useState('');

    useEffect(() => {
        const tokens = storage.getAssets();
        if(tokens.length===0) return;
        /**
            tokens = [
                {
                    name: 'WEthereum',
                    symbol: 'WETH',
                    address: '0x0000000000000000000000000000000000000001',
                    decimals: 19
                },
                {
                    name: 'GEthereum',
                    symbol: 'GETH',
                    address: '0x0000000000000000000000000000000000000002',
                    decimals: 20
                }
            ]
         */
        const allAssets = assets.concat(tokens);
        console.log(allAssets);
        setAssets(allAssets);
        setCurrentAsset(tokens[0]);
    }, []);

    const handleAssetChange = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        e.preventDefault();
        console.log(index);
        const current = assets[index] ?? null;
        if(!current) {
            setError('token not found');
            return;
        }
        setCurrentAsset(current);
    }

    return (
        <FormControl fullWidth sx={{width: 220}}>
            <InputLabel id="demo-simple-select-label">Asset</InputLabel>
            <Select 
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Assets"
                value={currentAsset.symbol}
                sx={{height: 64, minWidth: '250px'}}
            >   
                {assets?.map((asset: any, index: number) => 
                    <MenuItem 
                        key={asset.symbol+index}
                        value={asset.symbol}
                        onClick={e => handleAssetChange(e, index)}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}
                    > 
                        <Box component="div" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <img src={asset.icon ?? ""} alt="ethIcon"  style={{width: '24px', border:'1px solid #ddd', borderRadius:'50%', marginRight: '15px'}} />
                        {asset.symbol}
                        </Box>
                        <Box component="div" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Typography variant="body2" sx={{fontSize: '12px', color: '#777'}}>
                                Balance: {Number(formatEth(accountBalance)).toFixed(8)}
                            </Typography>
                        </Box>
                    </MenuItem>
                )}
            </Select>
            {error && <div style={{color: 'red'}}>{error}</div>}
        </FormControl>
    );
}

export default SelectAsset;