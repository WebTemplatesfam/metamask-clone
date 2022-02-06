import { ethers } from 'ethers';
const { REACT_APP_WEB3_PROVIDER_URL } = process.env;


export function weiToEth(amtInWei: string) {
  try {
    const amtInEth = ethers.utils.formatEther(amtInWei);
    return amtInEth;
  } 
  catch(error) {
    console.log(error);
  }
}

export async function getAccountBalance(address: string, web3Provider: ethers.providers.JsonRpcProvider) {
  try {
    const balance = await web3Provider.getBalance(address);
    return balance.toString();
  }
  catch(error) {
    console.log(error);
  }
}


export function createRandomWallet() {
  try {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
  }
  catch(error) {
    console.log(error);
  }
}

export function createWalletFromPrivateKey(privateKey:string, web3Provider: ethers.providers.JsonRpcProvider) {
  try {
    const wallet = new ethers.Wallet(privateKey, web3Provider);
    return wallet;
  }
  catch(error) {
    console.log(error);
  }
}

export async function importWalletFromMnemonicPhrase(mnemonicPhrase: string) {
  try {
    const wallet = ethers.Wallet.fromMnemonic(mnemonicPhrase);
    return wallet;
  }
  catch(error) {
    console.log(error);
  }
}

export function SHA256Hash(str: string) {
  try {
    const hash = ethers.utils.sha256(str);
    return hash;
  } 
  catch(error) {
    console.log(error);
  }
}

export function Keccak256(str: string) {
  try {
    const hash =  ethers.utils.keccak256(str);
    return hash;
  } 
  catch(error) {
    console.log(error);
  }
}

export function computePublicKey(publicOrPrivateKey: string) {
  try {
    const hash = ethers.utils.computePublicKey(publicOrPrivateKey);
    return hash;
  } 
  catch(error) {
    console.log(error);
  }
}

export function computeAddress(publicOrPrivateKey: string) {
  try {
    const hash = ethers.utils.computeAddress(publicOrPrivateKey);
    return hash;
  } 
  catch(error) {
    console.log(error);
  }
}
