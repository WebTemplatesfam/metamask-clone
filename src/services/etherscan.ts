import axios from 'axios';
const { REACT_APP_ETHERSCAN_API_KEY } = process.env;

const API_ENDPOINTS: any = {
    1: 'https://api.etherscan.io', //MAINNET
    4: 'https://api-rinkeby.etherscan.io', //RINKEBY  
};

/**
 *  GasPrinceInfo
 * 
 */

interface GasPrinceInfo {
    LastBlock: string,
    SafeGasPrice: string,
    ProposeGasPrice: string,
    FastGasPrice: string,
    suggestBaseFee: string,
    gasUsedRatio: string
}

export async function estimateGasPrice(chainID: number): Promise<GasPrinceInfo | any> {
    try {
        const ENDPOINT = API_ENDPOINTS[chainID] ?? '';
        if(ENDPOINT) throw new Error(`Etherscan Endpoint not found for chainID ${chainID}`);
        const response = await axios.post(`${ENDPOINT}/api?module=gastracker&action=gasoracle&apikey=${REACT_APP_ETHERSCAN_API_KEY}`)
        if(response?.data?.message!=='OK' || !response?.data?.result)
            throw new Error('Something went wrong with etherscan API');
        const gasPriceInfo = response.data.result;
        return gasPriceInfo;
    }
    catch(error) {
        throw error;
    }
}