import axios from "axios";

const BnbApiClient = require("@binance-chain/javascript-sdk");
const bnbRpc = require("@binance-chain/javascript-sdk/lib/rpc");

const api = "https://dex.binance.org/"; /// api string
const bnbClient = new BnbApiClient(api);
bnbClient.chooseNetwork("mainnet");
bnbClient.initChain();

export async function getBnbBalncesAndMarkets(address) {
  const myBalances = await bnbClient.getBalance(address);
  var myBalancesMap = new Map(myBalances.map(i => [i.symbol, i.free]));

  let currentPrices = await axios.get(
    "https://dex.binance.org/api/v1/ticker/24hr"
  );

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
