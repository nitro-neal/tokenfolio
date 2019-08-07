//helpers.js

// Todo
export function getCoinPrices(coinSymbols, binanceWorkflow) {
  var coinPriceMap = new Map();
  return coinPriceMap;
}

export async function download() {
  let urls = [];
  let fileNames = [];

  this.state.binanceAssets.forEach(asset => {
    let sybolIndex = asset.symbol.indexOf("_");
    let correctSymbol = asset.symbol.substring(
      0,
      sybolIndex !== -1 ? sybolIndex : asset.symbol.length
    );

    let urlToDl =
      "https://raw.githubusercontent.com/TrustWallet/tokens/master/blockchains/binance/assets/" +
      correctSymbol.toLowerCase() +
      "/logo.png";

    urls.push(urlToDl);
    fileNames.push(correctSymbol.toLowerCase());

    console.log(
      "wget " +
        "https://raw.githubusercontent.com/TrustWallet/tokens/master/blockchains/binance/assets/" +
        correctSymbol.toLowerCase() +
        "/logo.png" +
        " -O " +
        correctSymbol.toLowerCase() +
        ".png"
    );
  });
}
