import { func } from "prop-types";

// const NETWORK_URL = "https://ropsten-api.kyber.network"
// const NETWORK_URL = "https://api.kyber.network";
var NETWORK_URL = "";

const REF_ADDRESS = "0x16591D6eD1101dF43c46a027835C0717191Fb147";

var globalCallback = {};

async function startSimpleKyberTrade(myWeb3, trades, ethAccount, txToCompleteCallback, gasPrice, approvalsCallback) {
    var rawTxs = [];
    var approvals = [];
    var addedTxs = 0;

    for(var i = 0; i < trades.length; i ++) {
        if(! await isTokenEnabledForUser(trades[i].fromAddress, ethAccount)) {
            console.log("token not enabled! Enabling..")
            if(trades[i].from === 'ETH') {
                console.log('SELL TOKEN IS ETH SO SKIPPING ENABLE..')
            } else if (approvals.includes(trades[i].from)) {
                console.log('already includes..')
            } else {
                console.log('including ' + trades[i].from)
                rawTxs.push(await myEnableTokenTransfer(trades[i].fromAddress, ethAccount, gasPrice, myWeb3));
                addedTxs ++;
                approvals.push(trades[i].from)
                approvalsCallback(trades[i].from)
            }
        }
    }

    for(var i = 0; i < trades.length; i ++) {
        console.log('Gettin tx for trade:')
        console.log(trades[i].from + ' => ' + trades[i].to + ': ' + trades[i].amount)
    
        getTradeTx(trades[i].from, trades[i].to, trades[i].fromAddress, trades[i].toAddress, ethAccount, trades[i].amount, trades[i].otherTokenRecieveAmount, gasPrice, myWeb3, function callback(data) {
          rawTxs.push(data)
          if(rawTxs.length === trades.length + addedTxs) {
    
            console.log('READY TO SEND BATCH')
            // myBatchSendTranscation(rawTxs, approvals, trades, myWeb3, txToCompleteCallback);
            // callWeb3SendTransaction(myWeb3, rawTxs, 0)
            // myNewWay(myWeb3, rawTxs, approvals, trades, txToCompleteCallback)
            justInOrder(myWeb3, rawTxs, approvals, trades, txToCompleteCallback)
          }
        });
      }
}

function increaseNonse(web3, rawTxs) {
    for(var i = 0; i < rawTxs.length; i++) {
        console.log('before')
        console.log(rawTxs[i]['nonce']);
    }

    for(var i = 0; i < rawTxs.length; i++) {
        var nonce = rawTxs[i]['nonce'];
        var nonceFromHex = web3.utils.hexToNumber(nonce)
        var finalNonce = web3.utils.numberToHex((nonceFromHex + i))
        rawTxs[i]['nonce'] = (finalNonce);
        

        console.log('after')
        console.log(rawTxs[i]['nonce']);
    }
}

async function justInOrder(myWeb3, rawTxs, approvals, trades, txToCompleteCallback) {

    console.log('NEW WAY START')
    increaseNonse(myWeb3, rawTxs)
    var promise1;
    var counter = 0;

    for(var i = 0; i < approvals.length; i ++) {
        var tx = rawTxs[counter];
        var theApproval = approvals[i] + "-approval"

        promise1 = new Promise(function(resolve, reject) {
            doSendTransactionWithPromise(myWeb3, tx, theApproval, txToCompleteCallback, resolve)
        });
            
        let result = await promise1;

        counter ++;
    }

    let result = await promise1;

    for(var i = 0; i <trades.length; i ++) {
        var tx = rawTxs[counter];
        var theTrade = trades[i].from + '->' + trades[i].to;

        promise1 = new Promise(function(resolve, reject) {
            doSendTransactionWithPromise(myWeb3, tx, theTrade, txToCompleteCallback, resolve)
        });

        let result = await promise1;
        counter ++;
    }

}


function doSendTransaction(myWeb3, tx, theTrade, txToCompleteCallback) {
    myWeb3.eth.sendTransaction(tx)
            // .once('transactionHash', function(hash){ console.log("HASH " + hash)})
            // .once('confirmation', function(confNumber, receipt){ console.log("COMF " + confNumber)})
            .once('transactionHash', (hash) => txToCompleteCallback('transactionHash', hash, theTrade))
            .once('confirmation', (confNumber, receipt) => txToCompleteCallback('confirmation', confNumber, theTrade))
}


function doSendTransactionWithPromise(myWeb3, tx, theTrade, txToCompleteCallback, myResolve) {
    myWeb3.eth.sendTransaction(tx)
            // .once('transactionHash', function(hash){ console.log("HASH " + hash)})
            // .once('confirmation', function(confNumber, receipt){ console.log("COMF " + confNumber)})
            .once('transactionHash', (hash) => txToCompleteCallback('transactionHash', hash, theTrade))
            .once('transactionHash', (hash) => myResolve('wedidit'))
            .once('confirmation', (confNumber, receipt) => txToCompleteCallback('confirmation', confNumber, theTrade))
}

async function getTradeTx(sellToken, buyToken, sellTokenAddress, buyTokenAddress, userAddress, amountToSell, amountToBuy, gasPrice, myWeb3, callback) {
    console.log('!!!!!!!!!! Starting trade with :   ');
    console.log(amountToSell + " " + sellToken + " => "  + amountToBuy + " " + buyToken)

    var minDstQty = amountToBuy * 0.97;
    let rawTx = await executeTrade(userAddress,sellTokenAddress,buyTokenAddress,amountToSell,minDstQty,gasPrice,REF_ADDRESS);

    console.log(rawTx);
    callback(rawTx)
    return rawTx;
}

async function executeTrade(walletAddress,srcToken,dstToken,srcQty,minDstQty,gasPrice,refAddress) {
    let tradeDetailsRequest = await fetch(NETWORK_URL + '/trade_data?user_address=' + walletAddress + '&src_id=' + srcToken + '&dst_id=' + dstToken + '&src_qty=' + srcQty + '&min_dst_qty=' + minDstQty + '&gas_price=' + gasPrice + '&wallet_id=' + refAddress);
    console.log('THE REQUEST')
    console.log(tradeDetailsRequest)
    let tradeDetails = await tradeDetailsRequest.json();
    console.log("TRADE DETAILS")
    console.log(tradeDetails)
    let rawTx = tradeDetails.data[0];
    return rawTx;
  }



async function isTokenEnabledForUser(tokenAddress, walletAddress) {
    let enabledStatusesRequest = await fetch(NETWORK_URL + '/users/' + walletAddress + '/currencies');
    let enabledStatuses = await enabledStatusesRequest.json();
    for (var i=0; i < enabledStatuses.data.length; i++) {
        var token = enabledStatuses.data[i];
        if (token.id === tokenAddress) {
            return token.enabled;
        }
    }
}

async function myEnableTokenTransfer(tokenAddress, userAddress, gasPrice) {
    let enableTokenDetailsRequest = await fetch(`${NETWORK_URL}/users/${userAddress}/currencies/${tokenAddress}/enable_data?gas_price=${gasPrice}`);

    console.log('ENABLE TOKEN TRANSFER RAW TX + enableTokenDetailsRequest')
    console.log(enableTokenDetailsRequest)

    let enableTokenDetails = await enableTokenDetailsRequest.json();

    console.log('ENABLE TOKEN TRANSFER RAW TX + enableTokenDetails')
    console.log(enableTokenDetails)

    let rawTx = enableTokenDetails.data;

    console.log('ENABLE TOKEN TRANSFER RAW TX')
    console.log(rawTx)

    return rawTx;
}

//Other helper functions
async function getSupportedTokens(network) {
    let tokensBasicInfoRequest = await fetch(network + '/currencies')
    let tokensBasicInfo = await tokensBasicInfoRequest.json()
    return tokensBasicInfo;
}

async function getPast24HoursTokenInformation(network) {
    let past24HoursTokenInfoRequest = await fetch(network + '/change24h')
    let past24HoursTokenInfo = await past24HoursTokenInfoRequest.json()
    return past24HoursTokenInfo
}

export function getMarketInformation(info, network) {
    if(info === 'AVAIL_TOKENS') {
      return getSupportedTokens(network);
    } else if (info === 'PRICE_INFO') {
      return getPast24HoursTokenInformation(network);
    }
  }

export function startTrade(myWeb3, trades, gasPrice, tradeCallback, approvalsCallback, network) {
    NETWORK_URL = network;
    globalCallback = approvalsCallback;
    myWeb3.eth.getAccounts().then(ethAccount => startSimpleKyberTrade(myWeb3, trades, ethAccount, tradeCallback, gasPrice, approvalsCallback));
}