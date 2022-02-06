import React from 'react';
import LogoDiv from '../../components/LogoDiv/LogoDiv';
import ImportWallet from '../../components/ImportWallet/ImportWallet';
import CreateWallet from '../../components/CreateWallet/CreateWallet';
import './GetStarted.css'

function GetStarted(props: any) {


    return (
        <div>
        <LogoDiv />
        <div  className="get-started-container">
            <div className="welcome-msg">New to Z-Wallet ?</div>
            <div className="welcome-actions-div">
                <ImportWallet {...props} />
                <CreateWallet {...props} />
            </div>
        </div>
        </div>
    );

}

export default GetStarted;