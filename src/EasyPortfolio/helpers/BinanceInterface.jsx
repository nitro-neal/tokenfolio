import axios from "axios";

const BnbApiClient = require("@binance-chain/javascript-sdk");
const bnbRpc = require("@binance-chain/javascript-sdk/lib/rpc");

const api = "https://dex.binance.org/"; /// api string
const bnbClient = new BnbApiClient(api);
bnbClient.chooseNetwork("mainnet");
bnbClient.initChain();

export function connectWithPrivateKey(fileContents, password) {
  let privKeyJson = fileContents;
  let privKey = BnbApiClient.crypto.getPrivateKeyFromKeyStore(
    privKeyJson,
    password
  );
  bnbClient.setPrivateKey(privKey);

  console.log("init chain");
  bnbClient.initChain();
  console.log("after init chain");
  return bnbClient.getClientKeyAddress();
}

export async function getBnbBalncesAndMarkets(address) {
  console.log("get bnb balnaces");
  const myBalances = await bnbClient.getBalance(address);
  console.log("after get bnb balnaces");
  console.log(myBalances);
  var myBalancesMap = new Map(myBalances.map(i => [i.symbol, i.free]));

  let currentPrices = await axios.get(
    "https://dex.binance.org/api/v1/ticker/24hr"
  );

  console.log("current prices");
  console.log(currentPrices);

  const bnbPrice = parseFloat(
    currentPrices.data.filter(asset => asset.symbol === "BNB_USDSB-1AC")[0]
      .lastPrice
  );

  // Only have bnb pairs
  currentPrices = currentPrices.data.filter(
    asset =>
      asset.symbol.includes("_BNB") || asset.symbol.includes("BNB_USDSB-1AC")
  );

  currentPrices.forEach(asset => {
    if (myBalancesMap.has(asset.baseAssetName)) {
      asset.myBalance = parseFloat(myBalancesMap.get(asset.baseAssetName));
    } else {
      asset.myBalance = 0;
    }

    if (asset.symbol === "BNB_USDSB-1AC") {
      asset.currentUsdPrice = bnbPrice;
    } else {
      asset.currentUsdPrice = bnbPrice * parseFloat(asset.lastPrice);
    }
  });

  currentPrices = computeInitialPercentages(currentPrices);

  return currentPrices;
}

function computeInitialPercentages(currentPrices) {
  let totalUsdValue = 0;
  currentPrices.forEach(asset => {
    totalUsdValue += asset.currentUsdPrice * asset.myBalance;
  });

  currentPrices.forEach(asset => {
    if (asset.myBalance > 0) {
      asset.currentPortfolioPercent =
        ((asset.currentUsdPrice * asset.myBalance) / totalUsdValue) * 100.0;
      asset.newPortfolioPercent =
        ((asset.currentUsdPrice * asset.myBalance) / totalUsdValue) * 100.0;
      asset.inMyPortfolio = true;
    } else {
      asset.newPortfolioPercent = 0;
      asset.currentPortfolioPercent = 0;
      asset.inMyPortfolio = false;
    }

    let n = asset.baseAssetName.indexOf("-");
    let friendlyName = asset.baseAssetName.substring(
      0,
      n !== -1 ? n : asset.baseAssetName.length
    );

    asset.friendlyName = friendlyName;
  });

  return currentPrices;
}

export function computeTrades(stateAssets) {
  var trades = [];
  var assets = stateAssets.filter(asset => asset.inMyPortfolio);
  //   var assets = JSON.parse(JSON.stringify(stateAssets));
  var newPortfolioPercentMap = new Map();

  for (var iter = 0; iter < assets.length; iter++) {
    newPortfolioPercentMap.set(
      assets[iter].symbol,
      assets[iter].newPortfolioPercentMap
    );
    // assets[iter].usdNeeded =
    //   assets[iter].newPercentUsdValue - assets[iter].usdValue;
    assets[iter].usdNeeded =
      getNewUsdValue(assets, assets[iter]) - getCurrentUsdValue(assets[iter]);
    console.log(assets[iter].usdNeeded);
    console.log(assets[iter].newPercentUsdValue);
    console.log(getNewUsdValue(assets, assets[iter]));
  }

  for (var i = 0; i < assets.length; i++) {
    if (newPortfolioPercentMap.has(assets[i].symbol)) {
      if (
        newPortfolioPercentMap.get(assets[i].symbol) >=
        assets[i].currentPortfolioPercent
      ) {
        continue;
      }
    }

    for (var j = 0; j < assets.length; j++) {
      console.log(assets[j]);
      if (
        assets[i].usdNeeded < 0 &&
        assets[j].usdNeeded > 0 &&
        assets[i].symbol !== assets[j].symbol
      ) {
        var trade = {};
        trade.from = assets[i].symbol;
        trade.to = assets[j].symbol;

        trade.fromLogoName = assets[i].baseAssetName;
        trade.toLogoName = assets[j].baseAssetName;
        // trade.fromAddress = assets[i].tokenAddress;
        // trade.toAddress = assets[j].tokenAddress;
        // trade.bnamount = assets[i].bnamount;
        // trade.bndecimals = assets[i].bndecimals;

        // we need to pour money from negative to positive
        var negativeAmountLeftToGive =
          assets[i].usdNeeded + assets[j].usdNeeded;

        // still more to give, other is 0
        if (negativeAmountLeftToGive <= 0) {
          trade.usdAmount = assets[j].usdNeeded;
          // amount in from coin..
          trade.amount = assets[j].usdNeeded / assets[i].pricePerAsset;
          assets[i].usdNeeded = negativeAmountLeftToGive;
          assets[j].usdNeeded = 0;
        }

        // we gave it all
        if (negativeAmountLeftToGive > 0) {
          trade.usdAmount = Math.abs(assets[i].usdNeeded);
          trade.amount =
            Math.abs(assets[i].usdNeeded) / assets[i].pricePerAsset;
          assets[i].usdNeeded = 0;
          assets[j].usdNeeded = negativeAmountLeftToGive;
        }

        trade.otherTokenRecieveAmount =
          (trade.amount * assets[i].pricePerAsset) / assets[j].pricePerAsset;
        trades.push(trade);
      }
    }
  }

  console.log(trades);
  trades.forEach(trade => {
    console.log(
      "Trade: $" + trade.usdAmount + " " + trade.from + " => " + trade.to
    );
  });

  return trades;
}

function getCurrentUsdValue(asset) {
  return asset.currentUsdPrice * asset.myBalance;
}

function getTotalUsdValue(assets) {
  let totalUsdValue = 0;
  assets.forEach(asset => {
    if (asset.myBalance !== 0) {
      totalUsdValue += asset.currentUsdPrice * asset.myBalance;
    }
  });

  return totalUsdValue;
}

function getNewUsdValue(assets, asset) {
  var totalUsdValue = getTotalUsdValue(assets);
  return totalUsdValue * (asset.newPortfolioPercent / 100);
}

function getQantity(usdAmount, asset) {
  //   let amountInBnbTerms = usdAmount / bnbPrice;
  //   let quantity = amountInBnbTerms / asset.askPrice;
  //   return quantity;

  return usdAmount / asset.currentUsdPrice;
}

async function getSequence(address) {
  const sequenceURL = `${api}api/v1/account/${address}/sequence`;
  const seqNumberObj = await axios.get(sequenceURL);
  const seqNumber = seqNumberObj.data.sequence;
  return seqNumber;
}

async function getLotSizes() {
  let marketData = await axios.get("https://dex.binance.org/api/v1/markets");
  return marketData.data;
}

async function placeTrade(
  address,
  trades,
  assets,
  marketDataWithLotSizes,
  buy,
  confirmationCallback
) {
  for (let i = 0; i < trades.length; i++) {
    let orderReceipt;
    let asset;
    let assetPrice;
    let symbolMarketPair;
    let quantityRoundedToLotSize;
    let buyOrSell = buy === true ? 1 : 2;
    let timeInForce = 3; //(1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))
    let sequenceNumber = await getSequence(address);

    if (buy) {
      asset = assets.filter(asset => asset.symbol === trades[i].to)[0];
      symbolMarketPair = trades[i].to;
      assetPrice = asset.askPrice;
    } else {
      asset = assets.filter(asset => asset.symbol === trades[i].from)[0];
      symbolMarketPair = trades[i].from;
      assetPrice = asset.bidPrice;
    }

    let assetLotSize = parseFloat(
      marketDataWithLotSizes.filter(
        marketDatum => marketDatum.base_asset_symbol === asset.baseAssetName
      )[0].lot_size
    );

    let rawQuantity = getQantity(trades[i].usdAmount, asset);

    if (assetLotSize < 1) {
      quantityRoundedToLotSize = Math.round(rawQuantity);
    } else {
      quantityRoundedToLotSize =
        Math.round(rawQuantity / parseInt(assetLotSize)) *
        parseInt(assetLotSize);
    }

    console.log(
      `rawQuantity : ${rawQuantity} assetLotSize : ${assetLotSize} quantityRoundedToLotSize ${quantityRoundedToLotSize}`
    );

    console.log(
      `asset : ${
        asset.baseAssetName
      } address : ${address} symbolMarketPair : ${symbolMarketPair}  buyOrSell : ${buyOrSell}  assetPrice : ${assetPrice}  rawQuantity : ${rawQuantity} quantityRoundedToLotSize : ${quantityRoundedToLotSize}  sequenceNumber : ${sequenceNumber}  timeInForce : ${timeInForce} `
    );

    try {
      // docs - https://github.com/binance-chain/javascript-sdk/tree/master/docs#module_client.BncClient+placeOrder
      // bncClient.placeOrder(address, symbol, side, price, quantity, sequence, timeinforce)
      orderReceipt = await bnbClient.placeOrder(
        address,
        symbolMarketPair,
        buyOrSell,
        assetPrice,
        quantityRoundedToLotSize,
        sequenceNumber,
        timeInForce
      );
    } catch (error) {
      console.log(error);
    }

    console.log("order complete");
    console.log(orderReceipt);
    confirmationCallback(orderReceipt);
  }
}

export async function tradeOnBnbChain(
  trades,
  address,
  assets,
  confirmationCallback
) {
  //docs -= https://docs.binance.org/trading-spec.html#tick-size-and-lot-size

  // Do all bnb gainers first (ftm => bnb)
  // Three types of trades TO bnb, From bnb, or token to token

  //   const bnbPrice = parseFloat(
  //     currentPrices.data.filter(asset => asset.symbol === "BNB_USDSB-1AC")[0]
  //       .lastPrice
  //   );

  let marketDataWithLotSizes = await getLotSizes();
  let fromBnbTrades = trades.filter(trade => trade.from === "BNB_USDSB-1AC");
  let toBnbTrades = trades.filter(trade => trade.to === "BNB_USDSB-1AC");

  console.log(fromBnbTrades);

  console.log("lot sizes");
  console.log(marketDataWithLotSizes);

  placeTrade(
    address,
    fromBnbTrades,
    assets,
    marketDataWithLotSizes,
    true,
    confirmationCallback
  );
  placeTrade(
    address,
    toBnbTrades,
    assets,
    marketDataWithLotSizes,
    false,
    confirmationCallback
  );
}
