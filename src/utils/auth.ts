import { getLoginPasswordHash, getMnemonic, getPasswordHash } from '../services/storage';

export function hasLoggedIn() {
    const loginPwdHash = getLoginPasswordHash();
    const pwdHash = getPasswordHash();
    if(!pwdHash) return false;
    else if(!loginPwdHash) return false;
    else if(loginPwdHash!==pwdHash) return false;
    return true;
}

export function hasPassword() {
    const pwdHash = getPasswordHash();
    if(!pwdHash) return false;
    return true;
}


export function hasMnemonic() {
    const mnemonic = getMnemonic();
    if(!mnemonic) return false;
    return true;
}


export function redirect(startPath: string) {
    let redirectUrl ='';
    if(hasLoggedIn()) redirectUrl="/";
    else if(hasPassword()) redirectUrl="/login";
    else if(["/", "/login"].includes(startPath)) redirectUrl="/welcome";
    else redirectUrl=startPath;
    if(redirectUrl===startPath) return '';
    return redirectUrl;
}