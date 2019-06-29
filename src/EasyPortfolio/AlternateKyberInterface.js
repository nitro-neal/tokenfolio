// const NETWORK_URL = "https://ropsten-api.kyber.network" const NETWORK_URL =
// "https://api.kyber.network";
var NETWORK_URL = "";

// here is how to claim -
// https://developer.kyber.network/docs/Integrations-FeeSharing/
const REF_ADDRESS = "0x2c5713746EFb794a435BD1b790d911051AB8D04e";

var globalCallback = {};

async function startSimpleKyberTrade(
    myWeb3,
    trades,
    ethAccount,
    txToCompleteCallback,
    gasPrice,
    approvalsCallback
) {
    var rawTxs = [];
    var approvals = [];
    var addedTxs = 0;

    for (var i = 0; i < trades.length; i++) {
        if (!await isTokenEnabledForUser(trades[i].fromAddress, ethAccount)) {
            console.log("token not enabled! Enabling..")
            if (trades[i].from === 'ETH') {
                console.log('SELL TOKEN IS ETH SO SKIPPING ENABLE..')
            } else if (approvals.includes(trades[i].from)) {
                console.log('already includes..')
            } else {
                console.log('including ' + trades[i].from)
                rawTxs.push(
                    await myEnableTokenTransfer(trades[i].fromAddress, ethAccount, gasPrice, myWeb3)
                );
                addedTxs++;
                approvals.push(trades[i].from)
                approvalsCallback(trades[i].from)
            }
        }
    }

    for (var i = 0; i < trades.length; i++) {
        console.log('Gettin tx for trade:')
        console.log(trades[i].from + ' => ' + trades[i].to + ': ' + trades[i].amount)

        getTradeTx(
            trades[i].from,
            trades[i].to,
            trades[i].fromAddress,
            trades[i].toAddress,
            ethAccount,
            trades[i].amount,
            trades[i].bnamount,
            trades[i].bndecimals,
            trades[i].otherTokenRecieveAmount,
            gasPrice,
            myWeb3,
            function callback(data) {
                rawTxs.push(data)
                if (rawTxs.length === trades.length + addedTxs) {

                    console.log('READY TO SEND BATCH')
                    justInOrder(myWeb3, rawTxs, approvals, trades, txToCompleteCallback)
                }
            }
        );
    }
}

function increaseNonse(web3, rawTxs) {
    for (var i = 0; i < rawTxs.length; i++) {
        console.log('before')
        console.log(rawTxs[i]['nonce']);
    }

    for (var i = 0; i < rawTxs.length; i++) {
        var nonce = rawTxs[i]['nonce'];
        var nonceFromHex = web3
            .utils
            .hexToNumber(nonce)
        var finalNonce = web3
            .utils
            .numberToHex((nonceFromHex + i))
        rawTxs[i]['nonce'] = (finalNonce);

        console.log('after')
        console.log(rawTxs[i]['nonce']);
    }
}

async function justInOrder(
    myWeb3,
    rawTxs,
    approvals,
    trades,
    txToCompleteCallback
) {

    console.log('NEW WAY START')
    increaseNonse(myWeb3, rawTxs)
    var promise1;
    var counter = 0;

    for (var i = 0; i < approvals.length; i++) {
        var tx = rawTxs[counter];
        var theApproval = approvals[i] + "-approval"

        promise1 = new Promise(function (resolve, reject) {
            doSendTransactionWithPromise(
                myWeb3,
                tx,
                theApproval,
                txToCompleteCallback,
                resolve
            )
        });

        let result = await promise1;

        counter++;
    }

    let result = await promise1;

    for (var i = 0; i < trades.length; i++) {
        var tx = rawTxs[counter];
        var theTrade = trades[i].from + '->' + trades[i].to;

        promise1 = new Promise(function (resolve, reject) {
            doSendTransactionWithPromise(
                myWeb3,
                tx,
                theTrade,
                txToCompleteCallback,
                resolve
            )
        });

        let result = await promise1;
        counter++;
    }

}

function doSendTransactionWithPromise(
    myWeb3,
    tx,
    theTrade,
    txToCompleteCallback,
    myResolve
) {
    myWeb3
        .eth
        .sendTransaction(tx)
        // .once('transactionHash', function(hash){ console.log("HASH " + hash)})
        // .once('confirmation', function(confNumber, receipt){ console.log("COMF " +
        // confNumber)})
        .once(
            'transactionHash',
            (hash) => txToCompleteCallback('transactionHash', hash, theTrade)
        )
        .once('transactionHash', (hash) => myResolve('wedidit'))
        .once(
            'confirmation',
            (confNumber, receipt) => txToCompleteCallback('confirmation', confNumber, theTrade)
        )
}

async function getTradeTx(
    sellToken,
    buyToken,
    sellTokenAddress,
    buyTokenAddress,
    userAddress,
    amountToSell,
    amountBn,
    decimalsBn,
    amountToBuy,
    gasPrice,
    myWeb3,
    callback
) {
    console.log('!!!!!!!!!! Starting trade with :   ');
    console.log(
        amountToSell + " " + sellToken + " => " + amountToBuy + " " + buyToken
    )

    // var minDstQty = amountToBuy * 0.97;
    let sellQty = await getSellQty(sellTokenAddress, amountToSell);
    let buyQty = await getApproximateBuyQty(buyTokenAddress, amountToBuy);
    // let minDstQty = await getApproximateReceivableTokens(sellQty, buyQty, amountToSell);
    let minDstQty = amountToBuy * .97;

    console.log('sellQty ' + sellQty + " buyQty " + buyQty + " minDstQty " + minDstQty)

    // if(sellToken !== "ETH") {
    //     console.log('BN BUSINESS')
    //     console.log('amountToSell: ' + amountToSell + ' amountBn ' + parseFloat(amountBn.toString()) )

    //     var bignumasint = Math.pow(amountToSell, parseFloat(decimalsBn.toString()))
    //     console.log("bignumasint")
    //     console.log(bignumasint)
    //     var amountToSellInInteger = parseInt(Math.pow(amountToSell, parseFloat(decimalsBn.toString())))
    //     console.log('WEB3 WTF?')
    //     console.log(myWeb3)

    //     var dif = myWeb3.utils.toBN(amountToSellInInteger).sub(amountBn)
    //     console.log('amountToSellInInteger '+  amountToSellInInteger + ' VS ' + amountBn.toString() + ' THE DIFFERENCE IS ' + dif)

    //     if(Math.abs(parseFloat(amountBn) - amountToSell) < .0000001) {
    //         //USE BN Amount..
    //         console.log('using bn amount!!');
    //         console.log('amountToSell: ' + amountToSell + ' amountBn ' + amountBn )
    //         // amountToSell = amountBn;
    //     }
    // }

    console.log('BEFORE:' + amountToSell)
    amountToSell = floor10(amountToSell, -9);  // -55.6
    console.log('AFTER:' + amountToSell)

    let rawTx = await executeTrade(
        userAddress,
        sellTokenAddress,
        buyTokenAddress,
        amountToSell,
        minDstQty,
        gasPrice,
        REF_ADDRESS
    );

    console.log(rawTx);
    callback(rawTx)
    return rawTx;
}

async function getSellQty(tokenAddress, qty) {
    let sellQtyRequest = await fetch(
        `${NETWORK_URL}/sell_rate?id=${tokenAddress}&qty=${qty}`
    );
    let sellQty = await sellQtyRequest.json();
    sellQty = sellQty
        .data[0]
        .dst_qty[0];
    return sellQty;
}

async function getApproximateBuyQty(tokenAddress, qty) {
    let approximateBuyRateRequest = await fetch(
        `${NETWORK_URL}/buy_rate?id=${tokenAddress}&qty=${qty}`
    );
    let approximateBuyQty = await approximateBuyRateRequest.json();
    approximateBuyQty = approximateBuyQty
        .data[0]
        .src_qty[0];
    return approximateBuyQty;
}

//sellQty = output from getSellQty function
//buyQty = output from getApproximateBuyQty function
//srcQty = token qty amount to swap from (100 BAT tokens in scenario)
async function getApproximateReceivableTokens(sellQty, buyQty, srcQty) {
    let expectedAmountWithoutSlippage = buyQty / sellQty * srcQty;

    let expectedAmountWithSlippage = 0.97 * expectedAmountWithoutSlippage;
    console.log('expectedAmountWithSlippage')
    console.log(expectedAmountWithSlippage)
    console.log('expectedAmountWithoutSlippage')
    console.log(expectedAmountWithoutSlippage)

    return expectedAmountWithSlippage;
}

async function executeTrade(
    walletAddress,
    srcToken,
    dstToken,
    srcQty,
    minDstQty,
    gasPrice,
    refAddress
) {

    if(NETWORK_URL === "https://ropsten-api.kyber.network") {
        gasPrice = "high"
    }

    console.log('about to fetch')
    console.log(NETWORK_URL + '/trade_data?user_address=' + walletAddress + '&src_id=' + srcToken + '&dst_id=' + dstToken + '&src_qty=' + srcQty + '&min_dst_qty=' + minDstQty + '&gas_price=' + gasPrice + '&wallet_id=' + refAddress)

    let tradeDetailsRequest = await fetch(
        NETWORK_URL + '/trade_data?user_address=' + walletAddress + '&src_id=' +
        srcToken + '&dst_id=' + dstToken + '&src_qty=' + srcQty + '&min_dst_qty=' +
        minDstQty + '&gas_price=' + gasPrice + '&wallet_id=' + refAddress
    );

    console.log('THE REQUEST')
    console.log(tradeDetailsRequest)
    let tradeDetails = await tradeDetailsRequest.json();
    console.log("TRADE DETAILS")
    console.log(tradeDetails)
    let rawTx = tradeDetails.data[0];
    return rawTx;
}

async function isTokenEnabledForUser(tokenAddress, walletAddress) {
    let enabledStatusesRequest = await fetch(
        NETWORK_URL + '/users/' + walletAddress + '/currencies'
    );
    let enabledStatuses = await enabledStatusesRequest.json();
    for (var i = 0; i < enabledStatuses.data.length; i++) {
        var token = enabledStatuses.data[i];
        if (token.id === tokenAddress) {
            return token.enabled;
        }
    }
}

async function myEnableTokenTransfer(tokenAddress, userAddress, gasPrice) {
    let enableTokenDetailsRequest = await fetch(
        `${NETWORK_URL}/users/${userAddress}/currencies/${tokenAddress}/enable_data?gas_price=${gasPrice}`
    );

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
    if (info === 'AVAIL_TOKENS') {
        return getSupportedTokens(network);
    } else if (info === 'PRICE_INFO') {
        return getPast24HoursTokenInformation(network);
    }
}

export function startTrade(
    myWeb3,
    trades,
    gasPrice,
    tradeCallback,
    approvalsCallback,
    network
) {
    NETWORK_URL = network;
    globalCallback = approvalsCallback;
    myWeb3
        .eth
        .getAccounts()
        .then(
            ethAccount => startSimpleKyberTrade(myWeb3, trades, ethAccount, tradeCallback, gasPrice, approvalsCallback)
        );
}

function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal floor
const floor10 = (value, exp) => decimalAdjust('floor', value, exp);