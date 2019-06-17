import fetch from 'node-fetch'

const NETWORK_URL = "https://ropsten-api.kyber.network"
// const NETWORK_URL = "https://api.kyber.network";
var GAS_PRICE = "medium";
const REF_ADDRESS = "0x16591D6eD1101dF43c46a027835C0717191Fb147";

var tradeCompleteCallback = {};
var txToCompleteCallback = {};

async function mainStart(myWeb3, trades, ethAccount) {
  var permissionRawTxs = [];
  var rawTxs = [];

  var addedTxs = 0;

  for(var i = 0; i < trades.length; i ++) {
    if(! await isTokenEnabledForUser(trades[i].fromAddress, ethAccount)) {
      console.log("token not enabled! Enabling..")
      if(trades[i].from === 'ETH') {
        console.log('SELL TOKEN IS ETH SO SKIPPING ENABLE..')
      } else {
        rawTxs.push(await myEnableTokenTransfer(trades[i].fromAddress, ethAccount, GAS_PRICE, myWeb3));
        addedTxs ++;
      }
    }
  }

  // if(rawTxs.length > 0) {
  //   txToCompleteCallback(addedTxs)
  // }

  for(var i = 0; i < trades.length; i ++) {
    console.log('Gettin tx for trade:')
    console.log(trades[i].from + ' => ' + trades[i].to + ': ' + trades[i].amount)

    // var rawTx = await main(trades[i].from, trades[i].to, trades[i].fromAddress, trades[i].toAddress, ethAccount, trades[i].amount, trades[i].otherTokenRecieveAmount, myWeb3);
    main(trades[i].from, trades[i].to, trades[i].fromAddress, trades[i].toAddress, ethAccount, trades[i].amount, trades[i].otherTokenRecieveAmount, myWeb3, function callback(data) {
      rawTxs.push(data)
      if(rawTxs.length === trades.length + addedTxs) {

        console.log('READY TO SEND BATCH')
        myBatchSendTranscation(rawTxs, trades, myWeb3);
      }
    });
    // rawTxs.push(rawTx);
  }

  // var rawTxs = await Promise.all(promises);

  // myBatchSendTranscation(rawTxs, myWeb3);
}


async function main(sellToken, buyToken, sellTokenAddress, buyTokenAddress, userAddress, amountToSell, amountToBuy, myWeb3, callback) {

  ".001 ETH => 32 OMG"
  console.log('~~!@!@! Starting trade with :   ' + amountToSell + " " + sellToken + " => "  + amountToBuy + " " + buyToken )

  // TODO: I can remove this to save time..
  //Step 1: If either token is not supported, quit
  // if (! await isTokenSupported(sellTokenAddress) || ! await isTokenSupported(buyTokenAddress)) {
  //   console.log("token not supported")
  //   return;
  // }
  

  // NEW STEP 2:
  // checkAndApproveTokenContract(sellTokenAddress, userAddress, GAS_PRICE, globalDrizzle)

  // Step 2: Check if token is enabled
  // if(! await isTokenEnabledForUser(sellTokenAddress, userAddress)) {
  //   console.log("token not enabled! Enabling..")
  //   if(sellToken === 'ETH') {
  //     console.log('SELL TOKEN IS ETH SO SKIPPING ENABLE..')
  //   } else {
  //     await enableTokenTransfer(sellTokenAddress, userAddress, GAS_PRICE, myWeb3);
  //   }
  // }

  

  //Step 4: Get expected ETH qty from selling 100 BAT tokens
  let sellQty = await getSellQty(sellTokenAddress, amountToSell);

  // //Step 5: Get approximate DAI tokens receivable, set it to be minDstQty
  // let buyQty = await getApproximateBuyQty(buyTokenAddress, amountToBuy);
  // let minDstQty = await getApproximateReceivableTokens(sellQty, buyQty, amountToSell);
  // console.log("Perform trade with buyQty: " + buyQty + " and minDstQty: " + minDstQty);


  //TODO: REMOVE
  var minDstQty = amountToBuy * 0.97;
  //TODO: REMOVE

  //Step 6: Perform the BAT -> DAI trade
  let rawTx = await executeTrade(userAddress,sellTokenAddress,buyTokenAddress,amountToSell,minDstQty,GAS_PRICE,REF_ADDRESS);
  console.log(rawTx);
  callback(rawTx)
  return rawTx;
}

// async function checkAndApproveTokenContract(tokenAddress, userAddress, gasPrice, web3) {
//   let enabledStatusesRequest = await fetch(`${NETWORK_URL}/users/${userAddress}/currencies`);
//   let enabledStatuses = await enabledStatusesRequest.json();
//   console.log("ENABLED?")
//   console.log(enabledStatuses)
//   let txsRequired = 0;
//   for (let token of enabledStatuses.data) {
//     if (caseInsensitiveEquals(tokenAddress, token.id)) {
//       txsRequired = token.txs_required;
//       break;
//     }
//   }
//   switch (txsRequired) {
//     case 1:
//       console.log("Approving to max amount");
//       // No allowance so approve to maximum amount (2^255)
//       await enableTokenTransfer(tokenAddress, userAddress, gasPrice, web3);
//       break;
//     case 2:
//       // Allowance has been given but is insufficient.
//       // Have to approve to 0 first to avoid this issue https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
//       // Approve to 0
//       console.log("Approving to 0");
//       await enableTokenTransfer(tokenAddress, userAddress, gasPrice, web3);
//       // Approve to maximum amount (2^255)
//       console.log("Approving to max amount");
//       await enableTokenTransfer(tokenAddress, userAddress, gasPrice, web3);
//       break;
//     default:
//       // Shouldn't need to do anything else in other scenarios.
//       break;
//   }
// }

// function caseInsensitiveEquals(a, b) {
//   return typeof a === 'string' && typeof b === 'string' ?
//     a.localeCompare(b, undefined, {
//       sensitivity: 'accent'
//     }) === 0 :
//     a === b;
// }

// async function isTokenSupported(tokenAddress) {
//   let tokensBasicInfoRequest = await fetch(NETWORK_URL + '/currencies');
//   let tokensBasicInfo = await tokensBasicInfoRequest.json();
//     let tokenSupported = tokensBasicInfo.data.some(token => {return tokenAddress === token.id});
//     if (!tokenSupported) {
//         console.log('Token is not supported');
//     }
//     return tokenSupported;
// }

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

// async function enableTokenTransfer(tokenAddress, userAddress, gasPrice, myWeb3) {
//   let enableTokenDetailsRequest = await fetch(`${NETWORK_URL}/users/${userAddress}/currencies/${tokenAddress}/enable_data?gas_price=${gasPrice}`);
//   let enableTokenDetails = await enableTokenDetailsRequest.json();
//   let rawTx = enableTokenDetails.data;
//   //await broadcastTx(rawTx);
//   await mySendTranscation(rawTx, myWeb3);
// }


async function myEnableTokenTransfer(tokenAddress, userAddress, gasPrice, myWeb3) {
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


  //await broadcastTx(rawTx);
  // await mySendTranscation(rawTx, myWeb3);
}

// async function enableTokenTransfer(tokenAddress,walletAddress,gasPrice, globalDrizzle) {
//   // TODO: FIX THIS!
//   console.log('Enabling token.. hitting endpoint: ' + NETWORK_URL + '/users/' + walletAddress + '/currencies/' + tokenAddress + '/enable_data?gas_price=' + gasPrice)
//   let enableTokenDetailsRequest = await fetch(NETWORK_URL + '/users/' + walletAddress + '/currencies/' + tokenAddress + '/enable_data?gas_price=' + gasPrice);
//   let enableTokenDetails = await enableTokenDetailsRequest.json();

//   if(enableTokenDetails.error) {
//     console.log('Error in enabling token transfer: ')
//     console.log(enableTokenDetails);
//   }

//   let rawTx = enableTokenDetails.data;

//   await mySendTranscation(rawTx, globalDrizzle);
// }

// good example - https://github.com/ethereum/web3.js/issues/1125
async function mySendTranscation(rawTx, myWeb3) {
    console.log("About to sign rawTx NOT BATCH:");
    console.log(rawTx);
    var txReceipt = await myWeb3.eth.sendTransaction(rawTx);
    console.log("result" + JSON.stringify(txReceipt));
}

async function myBatchSendTranscation(rawTxs, trades, myWeb3) {
  console.log("About to sign BATCH rawTx:");
  console.log(rawTxs);

  // REVERSING ARRAY BECASUE BATHC IS BAD?
  //rawTxs.reverse();
  // txToCompleteCallback(rawTxs)

  const batch = new myWeb3.BatchRequest();

  for(var i = 0; i < rawTxs.length; i++) {
    // batch.add(globalDrizzle.web3.eth.sendTransaction(rawTxs[i], callBack).on('receipt', receipt => console.log('MY CALLBACK receipt', receipt)))
    // batch.add(myWeb3.eth.sendTransaction(rawTxs[i], callBack).on('receipt', mainscreencallback))

    // WORKS
    // batch.add(myWeb3.eth.sendTransaction(rawTxs[i])
    // .on('transactionHash', function(hash){console.log('NEW - transactionHash ' + hash); })
    // .on('receipt', function(receipt){console.log('NEW - receipt ' + receipt)})
    // .on('confirmation', function(confirmationNumber, receipt){ console.log('NEW - confirmation ' + confirmationNumber + " also: " + receipt) })
    // .on('error', console.error) // If a out of gas error, the second parameter is the receipt.
    // )

    var theTrade = trades[i].from + "->" + trades[i].to;
    console.log('trade executing')
    console.log(theTrade)

    

    // batch.add(myWeb3.eth.sendTransaction(rawTxs[i])
    // .on('transactionHash', (hash) => txToCompleteCallback("transactionHash", hash, theTrade))
    // // .on('transactionHash', function(hash, theTrade){txToCompleteCallback("transactionHash", hash, theTrade)})
    // // .on('receipt', function(receipt){txToCompleteCallback("transactionHash", hash)})
    // .on('confirmation', (confirmationNumber, receipt) => txToCompleteCallback("confirmation", confirmationNumber, theTrade))
    // .on('error', console.error) // If a out of gas error, the second parameter is the receipt.
    // )

    addToBatch(batch, myWeb3, rawTxs[i], theTrade)
  }

  console.log("BEFORE BATCH EXECUTE");
  try {
    batch.execute().then(console.log('THIS IS THE BATCH EXECUTE CALLBACK PROB NOT WORKING'));
  } catch (e) {
      // TODO: Fix this..
    console.log("Catching error for now...")
    //console.log(e)
  }

  console.log("AFTER BATCH EXECUTE");
}

function addToBatch(batch, myWeb3, rawTx, theTrade) {
  batch.add(myWeb3.eth.sendTransaction(rawTx)
    .on('transactionHash', (hash) => txToCompleteCallback("transactionHash", hash, theTrade))
    // .on('transactionHash', function(hash, theTrade){txToCompleteCallback("transactionHash", hash, theTrade)})
    // .on('receipt', function(receipt){txToCompleteCallback("transactionHash", hash)})
    .on('confirmation', (confirmationNumber, receipt) => txToCompleteCallback("confirmation", confirmationNumber, theTrade))
    .on('error', console.error));
}

function mainscreencallback(receipt) {
  console.log('MAIN SCREEN?')
  tradeCompleteCallback(receipt);
}

function callBack(error, hash) {
  console.log("callback result", hash);

  // (async function() {
  //   var txHash = hash;
  //   console.log('waiting for transaction for hash: ' + hash);
  //   const minedTxReceipt = await awaitTransactionMined.awaitTx(globalWeb3, txHash);
  //   console.log('Transaction mined: ' + minedTxReceipt);
  // })();
}

async function getSellQty(tokenAddress, qty) {
  let sellQtyRequest = await fetch(NETWORK_URL + '/sell_rate?id=' + tokenAddress + '&qty=' + qty);
  let sellQty = await sellQtyRequest.json();
  sellQty = sellQty.data[0].dst_qty[0];
  console.log('sellQty: ')
  console.log(sellQty)
  return sellQty;
}

async function getApproximateBuyQty(tokenAddress, qty) {
  // const QTY = 1; //Quantity used for the approximation
  let approximateBuyRateRequest = await fetch(NETWORK_URL + '/buy_rate?id=' + tokenAddress + '&qty=' + qty);
  console.log('buy_rate URL REQUEST')
  console.log(approximateBuyRateRequest);
  let approximateBuyQty = await approximateBuyRateRequest.json();
  console.log(approximateBuyQty)
  approximateBuyQty = approximateBuyQty.data[0].src_qty[0];
  return approximateBuyQty;
}

async function getApproximateReceivableTokens(sellQty, buyQty, srcQty) {
  let expectedAmountWithoutSlippage = buyQty / sellQty * srcQty;
  let expectedAmountWithSlippage = 0.97 * expectedAmountWithoutSlippage;
  return expectedAmountWithSlippage;
}

async function executeTrade(walletAddress,srcToken,dstToken,srcQty,minDstQty,gasPrice,refAddress) {
  let tradeDetailsRequest = await fetch(NETWORK_URL + '/trade_data?user_address=' + walletAddress + '&src_id=' + srcToken + '&dst_id=' + dstToken + '&src_qty=' + srcQty + '&min_dst_qty=' + minDstQty + '&gas_price=' + gasPrice + '&wallet_id=' + refAddress);
  console.log('THE REQUEST')
  console.log(tradeDetailsRequest)
  let tradeDetails = await tradeDetailsRequest.json();
  console.log("tradeDetails")
  console.log(tradeDetails)
  let rawTx = tradeDetails.data[0];
  return rawTx;
}

//Other helper functions
async function getSupportedTokens() {
  let tokensBasicInfoRequest = await fetch(NETWORK_URL + '/currencies')
  let tokensBasicInfo = await tokensBasicInfoRequest.json()
  return tokensBasicInfo;
}

async function getMarketInfo() {
  let marketInfoRequest = await fetch(NETWORK_URL + '/market')
  let marketInfo = await marketInfoRequest.json()
  return marketInfo
}

async function getPast24HoursTokenInformation() {
  // var headers = {
  //   // "Access-Control-Allow-Origin" : "*",
  //   // "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  //   "Accept": "*/*",
  //   "headerlol":"ok"
  // }

  var myHeaders = new Headers({
    "Content-Type": "text/plain",
    "X-Custom-Header": "ProcessThisImmediately",
  });

  // let past24HoursTokenInfoRequest = await fetch(NETWORK_URL + '/change24h', {method: 'GET', headers: myHeaders})
  let past24HoursTokenInfoRequest = await fetch(NETWORK_URL + '/change24h')
  let past24HoursTokenInfo = await past24HoursTokenInfoRequest.json()
  return past24HoursTokenInfo
}

export function getMarketInformation(info) {
  if(info === 'AVAIL_TOKENS') {
    return getSupportedTokens();
  } else if (info === 'PRICE_INFO') {
    return getPast24HoursTokenInformation();
  }
}


export function startTrade(myWeb3, trades, gasPrice, tradeCallback, txCallback) {
  
    tradeCompleteCallback = tradeCallback;
    txToCompleteCallback = txCallback;
    GAS_PRICE = gasPrice;

    console.log("Start trade start")
    myWeb3.eth.getAccounts().then(ethAccount => mainStart(myWeb3, trades, ethAccount));
    console.log("Start trade end")
}
