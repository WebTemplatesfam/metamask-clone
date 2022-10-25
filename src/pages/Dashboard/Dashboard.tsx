import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { setWeb3Provider, getNetworkByChainID, unsubscribeIfExistAllAccountBalances, subscribeAccountBalance } from '../../utils/ethers';
import { NETWORK_CHAIN_ID, NETWORKS } from '../../utils/constants';
import AccountInfo from '../../components/AccountInfo/AccountInfo';
import * as storage from '../../services/storage';
import { decryptData } from '../../utils/crypto';
import './Dashboard.css';
import NewAccountModal from '../../components/NewAccount/NewAccount';
import ImportAccountModal from '../../components/ImportAccount/ImportAccount';
import ViewAccountModal from '../../components/ViewAccount/ViewAccount';
import SendTokenModal from '../../components/SendToken/SendToken';
import {BigNumber, ethers} from 'ethers';
import { HDNode } from 'ethers/lib/utils';




function Dashboard(props: any) {

    const [provider, setProvider] = useState(setWeb3Provider(NETWORK_CHAIN_ID.GOERLI));

    const [chainID, setChainID] = useState(NETWORK_CHAIN_ID.GOERLI);
    const [network, setNetwork] = useState(getNetworkByChainID(NETWORK_CHAIN_ID.GOERLI));
    const [networkInfo, setNetworkInfo] = useState(NETWORKS.find(ntwrk => ntwrk.chainID===NETWORK_CHAIN_ID.GOERLI));
    const [accounts, setAccounts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentAccount, setCurrentAccount] = useState<Partial<HDNode>>();
    const [openNewAccountModal, setOpenNewAccountModal] = useState(false);
    const [openImportAccountModal, setOpenImportAccountModal] = useState(false);
    const [openViewAccountModal, setOpenViewAccountModal] = useState(false);
    const [openSendTokenModal, setOpenSendTokenModal] = useState(false);
    const [accountBalance, setAccountBalance] = useState(BigNumber.from(0));


    useEffect(() => {
      setProvider(setWeb3Provider(chainID));
      const ntwrk = getNetworkByChainID(chainID);
      setNetwork(ntwrk);
      const ntwrkInfo = NETWORKS.find(ntwrk => ntwrk.chainID===chainID);
      setNetworkInfo(ntwrkInfo);
    }, [chainID]);

    useEffect(() => {
        const accts = storage.getAccounts();
        const accountsInfo = accts.map((acct: any) => { 
            const account = decryptData(acct);
            return {
                address: account?.address,
                name: storage.getAccountName(account.address),
                isImported: account?.isImported ? true : false
            }
        });
        setAccounts(accountsInfo);
    }, [])

    useEffect(() => {
        const index = storage.getAccountIndex();
        setCurrentIndex(index);
        const account = storage.getAccount(index);
        setCurrentAccount(account);
    }, []);

    useEffect(() => {
    
        if(!provider) return;
        
        unsubscribeIfExistAllAccountBalances(provider);
        subscribeAccountBalance(provider, currentAccount?.address, (balance: ethers.BigNumber) => {
            if(balance.eq(accountBalance)) return;
            setAccountBalance(balance);
        });
       
        return () => {
            unsubscribeIfExistAllAccountBalances(provider);
        }
    
    }, [provider, currentAccount])


    return (
        <div>
            <Navbar 
                {...props}
                setChainID={setChainID}

                accounts={accounts}
                setAccounts={setAccounts}

                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}

                currentAccount={currentAccount}
                setCurrentAccount={setCurrentAccount}

                setOpenNewAccountModal={setOpenNewAccountModal}
                setOpenImportAccountModal={setOpenImportAccountModal}

                // setWeb3Provider={setProvider}
                provider={provider}
            />

            <AccountInfo 
                chainID={chainID}
                currentAccount={currentAccount}
                setOpenViewAccountModal={setOpenViewAccountModal}
                provider={provider}
                networkInfo={networkInfo}
                setOpenSendTokenModal={setOpenSendTokenModal}
                accountBalance={accountBalance}
                setAccountBalance={setAccountBalance}
            />

            <NewAccountModal 
                open={openNewAccountModal}
                setOpen={setOpenNewAccountModal}
                accounts={accounts}
                setCurrentAccount={setCurrentAccount}
                setCurrentIndex={setCurrentIndex}
                setAccounts={setAccounts}
            />

            <ImportAccountModal
                open={openImportAccountModal}
                setOpen={setOpenImportAccountModal}
                accounts={accounts}
                setCurrentAccount={setCurrentAccount}
                setCurrentIndex={setCurrentIndex}
                setAccounts={setAccounts}
            />

            <ViewAccountModal
                open={openViewAccountModal}
                setOpen={setOpenViewAccountModal}
                currentAccount={currentAccount}
                chainID={chainID}
            />          

            <SendTokenModal 
                open={openSendTokenModal}
                setOpen={setOpenSendTokenModal}
                provider={provider}
                currentAccount={currentAccount}
                chainID={chainID}
                accounts={accounts}     
                accountBalance={accountBalance}
                setAccountBalance={setAccountBalance} 
            />
            {/* <AssetInfo /> */}
            {/* <ActivityInfoCard /> */}
        </div>
    );
}

export default Dashboard;