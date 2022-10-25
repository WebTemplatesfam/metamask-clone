import { HDNode} from 'ethers/lib/utils';
import { SHA256Hash, encryptData, decryptData } from '../utils/crypto';
const { REACT_APP_ACCOUNT_INDEX_START } = process.env;

export function getLoginPasswordHash() {
    const hash = localStorage.getItem('login') ?? '';
    if(!hash) return '';
    return hash;
}

export function setLoginPassword(passwordHash: string) {
    if(!passwordHash) throw new Error('password required to login');
    localStorage.setItem('login', passwordHash);
    const TIME_INTERVAL = 4*60*60*1000;
    setTimeout(() => {
        localStorage.removeItem('login');
    }, TIME_INTERVAL);  
}

export function clearLoginPassword() {
    localStorage.removeItem('login');
}

export function getPasswordHash() {
    const hash = localStorage.getItem('pwdHash') ?? '';
    if(!hash) return '';
    return hash;
}

export function setPassword(passwordHash: string) {
    localStorage.setItem('pwdHash', passwordHash); 
}

export function getMnemonic() {
    const mnemonicEnc = localStorage.getItem('mnemonic') ?? '';
    if(!mnemonicEnc) return '';
    const mnemonic = decryptData(mnemonicEnc);
    return mnemonic;
}

export function setMnemonic(mnemonic: string) {
    const mnemonicEnc = encryptData(mnemonic);
    localStorage.setItem('mnemonic', mnemonicEnc);
}

export function getRootNode():HDNode {
    const rootEnc = localStorage.getItem('HDRoot') ?? '';
    if(!rootEnc) {
        throw Error("HD Root not found");
    }
    const root = decryptData(rootEnc);
    return root;
}


export function getAccountIndex() {
    const indexEnc = localStorage.getItem('accountIndex') ?? null;
    if(!indexEnc) return -1;
    const index = Number(decryptData(indexEnc));
    return index;   
}

export function setAccountIndex(index: number) {
    const accountIndexEnc = encryptData(index);
    localStorage.setItem('accountIndex', accountIndexEnc);
}

export function getLastPathIndex() {
    const lastIndexEnc = localStorage.getItem('lastPathIndex') ?? null;
    if(!lastIndexEnc) return -1;
    const lastIndex = Number(decryptData(lastIndexEnc));
    return lastIndex;
}

export function setLastPathIndex(index: number) {
    const lastIndexEnc = encryptData(index);
    localStorage.setItem('lastPathIndex', lastIndexEnc);
}

export function getLastWalletIndex() {
    const accounts = getAccounts();
    return accounts?.length ? accounts.length-1 : -1;
}

export function getAccount(index: number) {
    const accounts = getAccounts();
    if(!accounts) return null;
    const account=decryptData(accounts[index]);
    return account;
}

export function getAccountName(address: string) {
    const accountNameMapJSON = localStorage.getItem('accountNames') ?? '';
    if(!accountNameMapJSON) return {};
    const accountNameMap = JSON.parse(accountNameMapJSON);
    return accountNameMap[address];
}


export function setAccountName(name: string, address: string) {
    const accontNameMapJSON = localStorage.getItem('accountNames') ?? '';
    const accountNameMap: any = accontNameMapJSON ? JSON.parse(accontNameMapJSON) : {};
    accountNameMap[address] = name;
    localStorage.setItem('accountNames', JSON.stringify(accountNameMap));
}

export function setAccount(account: Partial<HDNode>) {
    const accountEnc = encryptData(account);
    const accounts = getAccounts();
    accounts.push(accountEnc);
    setAccounts(accounts);
}

export function getAccounts() {
    const accountsJSON = localStorage.getItem('accounts') ?? '';
    if(!accountsJSON) return [];
    return JSON.parse(accountsJSON);
}

export function setAccounts(accounts: any[]) {
    const accountsJSON = JSON.stringify(accounts);
    localStorage.setItem('accounts', accountsJSON)
}

export function getAssets() {
    const assetsJSON = localStorage.getItem('assets') ?? '';
    if(!assetsJSON) return [];
    const assets = JSON.parse(assetsJSON);
    return assets;
}

