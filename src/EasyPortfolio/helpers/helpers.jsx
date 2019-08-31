//helpers.js

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

export function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + chr + str.substr(index + 1);
}

export function generateShareLink(development, binanceAssets) {
  let url;

  if (development) {
    url = "http://binance.localhost:3000/portfolio";
  } else {
    url = "https://binance.tokenfolio.cc/portfolio";
  }

  binanceAssets.forEach(asset => {
    if (asset.inMyPortfolio) {
      // url +
    }
  });
}
