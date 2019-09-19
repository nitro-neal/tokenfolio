import React, { Component } from "react";
import axios from "axios";
import PortfolioJumbotron from "./PortfolioJumbotron";
import { MDBAnimation, MDBRow, MDBCol } from "mdbreact";

class Portfolios extends Component {
  state = {
    historicData: {},
    symbolMap: new Map(),
    baseAssetNameMap: null,
    oneDayPercentGainMap: null,
    sevenDayPercentGainMap: null,
    thirtyDayPercentGainMap: null
  };

  componentDidMount() {
    this.getPortfolios();
  }

  getPortfolios = async () => {
    let baseAssetNameMap = new Map();
    let symbolMap = new Map();
    let oneDayPercentGainMap = new Map();
    let sevenDayPercentGainMap = new Map();
    let thirtyDayPercentGainMap = new Map();

    let historicData = await axios.get(
      "https://binance-chain-price-metrics-yrevdxsg4q-uc.a.run.app/api/performance"
    );

    console.log("historicData");
    console.log(historicData);
    if (historicData.data.length === 0) {
      return;
    }

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

      oneDayPercentGainMap.set(
        friendlyName.toUpperCase(),
        parseFloat(asset.priceChangePercent).toFixed(2)
      );
    });

    historicData.data.forEach(d => {
      sevenDayPercentGainMap.set(d.friendlyName, d.sevenDayPerformance);
      thirtyDayPercentGainMap.set(d.friendlyName, d.thirtyDayPercentChange);
    });

    this.setState({ historicData: historicData.data });
    this.setState({ baseAssetNameMap: baseAssetNameMap });
    this.setState({ symbolMap: symbolMap });
    this.setState({ oneDayPercentGainMap: oneDayPercentGainMap });

    this.setState({ sevenDayPercentGainMap: sevenDayPercentGainMap });
    this.setState({ thirtyDayPercentGainMap: thirtyDayPercentGainMap });
  };

  getPortfolio = name => {
    if (name === "bnbHeavy") {
      return [
        this.generatePortfolioObject("BNB", 80),
        this.generatePortfolioObject("MATIC", 10),
        this.generatePortfolioObject("ONE", 10)
      ];
    }

    if (name === "sTier") {
      return [
        this.generatePortfolioObject("BNB", 25),
        this.generatePortfolioObject("TOMOB", 25),
        this.generatePortfolioObject("RAVEN", 25),
        this.generatePortfolioObject("RUNE", 25)
      ];
    }

    if (name === "thirtyDayMarketVolume") {
      let fourteenDayVolume = this.getHistoricMetrics("thirtyDayMarketVolume");
      return [
        this.generatePortfolioObject("BNB", 20),
        this.generatePortfolioObject(fourteenDayVolume[0].friendlyName, 20),
        this.generatePortfolioObject(fourteenDayVolume[1].friendlyName, 20),
        this.generatePortfolioObject(fourteenDayVolume[2].friendlyName, 20),
        this.generatePortfolioObject(fourteenDayVolume[3].friendlyName, 20)
      ];
    }

    if (name === "thirtyDayNumberOfTrades") {
      let numOfTrades = this.getHistoricMetrics("thirtyDayMarketVolume");
      return [
        this.generatePortfolioObject("BNB", 20),
        this.generatePortfolioObject(numOfTrades[0].friendlyName, 20),
        this.generatePortfolioObject(numOfTrades[1].friendlyName, 20),
        this.generatePortfolioObject(numOfTrades[2].friendlyName, 20),
        this.generatePortfolioObject(numOfTrades[3].friendlyName, 20)
      ];
    }

    if (name === "biggestLosses") {
      let bigLosses = this.getHistoricMetrics("biggestLosses");
      return [
        this.generatePortfolioObject("BNB", 10),
        this.generatePortfolioObject(bigLosses[0].friendlyName, 30),
        this.generatePortfolioObject(bigLosses[1].friendlyName, 30),
        this.generatePortfolioObject(bigLosses[2].friendlyName, 30)
      ];
    }

    if (name === "biggestGains") {
      let bigGains = this.getHistoricMetrics("biggestGains");
      return [
        this.generatePortfolioObject("BNB", 10),
        this.generatePortfolioObject(bigGains[0].friendlyName, 30),
        this.generatePortfolioObject(bigGains[1].friendlyName, 30),
        this.generatePortfolioObject(bigGains[2].friendlyName, 30)
      ];
    }

    if (name === "biggestGains14Days") {
      let bigGains = this.getHistoricMetrics("biggestGains");
      return [
        this.generatePortfolioObject("BNB", 10),
        this.generatePortfolioObject(bigGains[0].friendlyName, 30),
        this.generatePortfolioObject(bigGains[1].friendlyName, 30),
        this.generatePortfolioObject(bigGains[2].friendlyName, 30)
      ];
    }
  };

  getHistoricMetrics = metric => {
    if (metric === "thirtyDayMarketVolume") {
      let fourteenDayVolume = this.state.historicData.sort(
        (a, b) =>
          parseFloat(a.thirtyDayMarketVolume) -
          parseFloat(b.thirtyDayMarketVolume)
      );
      fourteenDayVolume.reverse();
      // fourteenDayVolume = fourteenDayVolume.filter(
      //   a => a.thirtyDayMarketVolume !== -999
      // );
      return fourteenDayVolume;
    }

    if (metric === "thirtyDayNumberOfTrades") {
      let numOfTrades = this.state.historicData.sort(
        (a, b) =>
          parseFloat(a.thirtyDayNumberOfTrades) -
          parseFloat(b.thirtyDayNumberOfTrades)
      );
      numOfTrades.reverse();
      // numOfTrades = numOfTrades.filter(a => a.thirtyDayNumberOfTrades !== -999);
      return numOfTrades;
    }

    if (metric === "biggestLosses") {
      let bigLosses = this.state.historicData.sort(
        (a, b) =>
          parseFloat(a.thirtyDayPercentChange) -
          parseFloat(b.thirtyDayPercentChange)
      );
      bigLosses = bigLosses.filter(a => a.thirtyDayPercentChange !== -999);
      return bigLosses;
    }

    if (metric === "biggestGains") {
      let bigGains = this.state.historicData.sort(
        (a, b) =>
          parseFloat(a.thirtyDayPercentChange) -
          parseFloat(b.thirtyDayPercentChange)
      );
      bigGains = bigGains.filter(a => a.thirtyDayPercentChange !== -999);
      bigGains.reverse();
      return bigGains;
    }

    if (metric === "biggestGains14Days") {
      let bigGains = this.state.historicData.sort(
        (a, b) =>
          parseFloat(a.fourteenDayPerformance) -
          parseFloat(b.fourteenDayPerformance)
      );
      bigGains = bigGains.filter(a => a.fourteenDayPerformance !== -999);
      bigGains.reverse();
      return bigGains;
    }
  };

  generatePortfolioObject = (name, percent) => {
    return {
      baseAssetName: this.state.baseAssetNameMap.get(name),
      newPortfolioPercent: percent,
      realName: name,
      //   friendlyName: "Binance Coin",
      percentGainOneDay: this.state.oneDayPercentGainMap.get(name),
      percentGainSevenDays: this.state.sevenDayPercentGainMap.get(name),
      percentGainThirtyDays: this.state.thirtyDayPercentGainMap.get(name)
    };
  };

  render() {
    return (
      <>
        {this.state.baseAssetNameMap === null ||
        this.state.oneDayPercentGainMap === null ||
        this.state.sevenDayPercentGainMap === null ||
        this.state.thirtyDayPercentGainMap === null ? (
          <p> Loading Data.. (this could take up to 10 minutes)</p>
        ) : (
          <>
            <MDBRow>
              <MDBCol size="4"></MDBCol>
              <MDBCol size="4">
                <MDBAnimation type={"flipInX"}>
                  <div className="logo">
                    <a href="/">
                      <img
                        className="img-fluid"
                        alt="Tokenfolio logo"
                        src="/tflogo.png"
                      />
                    </a>
                  </div>
                </MDBAnimation>
              </MDBCol>
              <MDBCol size="4"></MDBCol>
            </MDBRow>

            <PortfolioJumbotron
              title="BNB Heavy"
              lead="A conservative portfolio with Binance Coin along with other robust coins."
              assets={this.getPortfolio("bnbHeavy")}
            />

            <PortfolioJumbotron
              title="Biggest Gains"
              lead="These are the coins that show the biggest gains over a 30 day period."
              assets={this.getPortfolio("biggestGains")}
            />

            <PortfolioJumbotron
              title="Biggest Losses"
              lead="These are the coins that show the biggest losses over a 30 day. Big risk big reward!"
              assets={this.getPortfolio("biggestLosses")}
            />

            <PortfolioJumbotron
              title="Biggest Gains 14 Days"
              lead="These are the coins that show the biggest gains over a 14 day period."
              assets={this.getPortfolio("biggestGains14Days")}
            />

            <PortfolioJumbotron
              title="S Tier Portfolio"
              lead="These are very promising projects that show amazing potential.
            The cream of the crop."
              assets={this.getPortfolio("sTier")}
            />

            {/* <PortfolioJumbotron
              title="Highest Volume Portfolio"
              lead="These are the coins that show the highest 30 day volume."
              assets={this.getPortfolio("thirtyDayMarketVolume")}
            /> */}

            <PortfolioJumbotron
              title="Most Traded Coins"
              lead="These are the coins that show have the highest number of trades over 30 days."
              assets={this.getPortfolio("thirtyDayNumberOfTrades")}
            />
          </>
        )}
      </>
    );
  }
}

export default Portfolios;
