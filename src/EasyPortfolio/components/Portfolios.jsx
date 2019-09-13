import React, { Component } from "react";
import axios from "axios";
import PortfolioJumbotron from "./PortfolioJumbotron";

class Portfolios extends Component {
  state = {
    portfolios: {},
    symbolMap: new Map(),
    baseAssetNameMap: null,
    percentGainMap: null
  };

  componentDidMount() {
    this.getPortfolios();
  }

  getPortfolios = async () => {
    // let portfolios = await axios.get(
    //   "https://binance-chain-price-metrics-yrevdxsg4q-uc.a.run.app/api/performance"
    // );

    // let portfolios = await axios.get("http://localhost:8080/api/performance");

    let baseAssetNameMap = new Map();
    let symbolMap = new Map();
    let percentGainMap = new Map();

    let currentPrices = await axios.get(
      "https://dex.binance.org/api/v1/ticker/24hr"
    );

    // Only have bnb pairs
    currentPrices = currentPrices.data.filter(
      asset =>
        asset.symbol.includes("_BNB") || asset.symbol.includes("BNB_USDSB-1AC")
    );

    currentPrices.forEach(asset => {
      let n = asset.baseAssetName.indexOf("-");
      let friendlyName = asset.baseAssetName.substring(
        0,
        n !== -1 ? n : asset.baseAssetName.length
      );
      baseAssetNameMap.set(
        friendlyName.toUpperCase(),
        asset.baseAssetName.toUpperCase()
      );

      symbolMap.set(friendlyName.toUpperCase(), asset.symbol.toUpperCase());

      percentGainMap.set(
        friendlyName.toUpperCase(),
        parseFloat(asset.priceChangePercent).toFixed(2)
      );
    });

    // this.setState({ portfolios: portfolios.data });
    this.setState({ baseAssetNameMap: baseAssetNameMap });
    this.setState({ symbolMap: symbolMap });
    this.setState({ percentGainMap: percentGainMap });
    console.log(currentPrices);

    console.log("finished loasd?");
    console.log(baseAssetNameMap.get("FTM"));
    console.log(percentGainMap.get("FTM"));
    console.log(symbolMap.get("FTM"));
  };

  getPortfolio = name => {
    console.log(this.state.baseAssetNameMap);
    if (name === "solid3") {
      console.log("return solid t3");
      return [
        { baseAssetName: "BNB", newPortfolioPercent: 34 },
        this.generatePortfolioObject("FTM", 33),
        { baseAssetName: "RAVEN", newPortfolioPercent: 33 }
      ];
    }

    if (name === "bnbHeavy") {
      return { BNB: 80, FTM: 10, RAVEN: 10 };
    }
  };

  generatePortfolioObject = (name, percent) => {
    console.log(this.state.baseAssetNameMap);
    return {
      baseAssetName: this.state.baseAssetNameMap.get(name),
      newPortfolioPercent: percent,
      realName: name,
      //   friendlyName: "Binance Coin",
      percentGain: this.state.percentGainMap.get(name)
    };
  };

  render() {
    return (
      <>
        {this.state.baseAssetNameMap === null ||
        this.state.percentGainMap === null ? (
          ""
        ) : (
          <PortfolioJumbotron
            title="Solid Three"
            assets={this.getPortfolio("solid3")}
          />
        )}
      </>
    );
  }
}

export default Portfolios;
