export function getAccountBackgroundColor(address: string='') {
    return address ? `#${address.substring(2,8)}`: '#1876D0';
}