import React, { Component } from "react";
import axios from "axios";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBModal,
  MDBModalBody,
  MDBModalHeader
} from "mdbreact";
import {
  walletConnectInit,
  isWalletConnected
} from "../helpers/WalletConnectHelper";
import { setCharAt, generateShareLink } from "../helpers/helpers";
import {
  getBnbBalncesAndMarkets,
  computeTrades,
  tradeOnBnbChain,
  connectWithPrivateKey
} from "../helpers/BinanceInterface";
import RebalanceModal from "./RebalanceModal";
import ConnectionScreen from "./ConnectionScreen";
import RebalancePortfolioScreen from "./RebalancePortfolioScreen";
import ComparePortfolioScreen from "./ComparePortfolioScreen";
import ShareModal from "./ShareModal";

const INITIAL_STATE = {
  file: null,
  password: null,
  binanceWorkflow: false,
  walletConnector: null,
  binanceAssets: [],
  portfolioCompareAssets: [],
  binanceAddress: "",
  rebalanceModal: false,
  currentTrades: [],
  confirmations: [],
  connected: false,
  development: false,
  settingsModal: false,
  comparePortfolio: false,
  comparePortfolioName: "",
  shareModal: false,
  shareLink: "https://binance.tokenfolio.cc/"
};

class Tokenfolio extends Component {
  state = { ...INITIAL_STATE };

  componentDidMount() {
    this.parseHref();
    this.init(this.props.binanceWorkflow);

    this.setState({ binanceWorkflow: this.props.binanceWorkflow });
    this.setState({ development: this.props.development });

    // if (this.props.development) {
    //   const myData = require("./data.json");
    //   this.connectWithPrivateKey(myData.file, myData.p);
    // }
  }

  init = async binanceWorkflow => {
    if (binanceWorkflow) {
      if (isWalletConnected()) {
        await this.connectToWallet();
        await this.setState({ connected: isWalletConnected() });
      } else {
        // show login screen
      }

      if (this.state.walletConnector && this.state.walletConnector.connected) {
        this.initBinanceWorkflow(this.state.walletConnector.accounts[0]);
      }
    } else {
      console.log("Init with ethereum workflow");
    }
  };

  initBinanceWorkflow = async address => {
    console.log("initBinanceWorkflow:  " + address);
    let binanceAssets = await getBnbBalncesAndMarkets(address);
    this.setState({ binanceAssets: binanceAssets });
    this.setState({ binanceAddress: address });
  };

  clickWalletConnect = async () => {
    this.connectToWallet();
  };

  clickWalletConnectDisconnect = () => {
    if (this.state.walletConnector !== null) {
      this.state.walletConnector.killSession();
      this.setState({ walletConnector: null });
      this.setState({ connected: false });
      this.init();
    }
  };

  connectToWallet = async () => {
    let walletConnector = await walletConnectInit(
      this.walletConnectHasConnectedCallback
    );
    this.setState({ walletConnector: walletConnector });
  };

  walletConnectHasConnectedCallback = payload => {
    WalletConnectQRCodeModal.close();
    this.setState({ connected: true });
    this.init(true);
  };

  // TODO: put disconnect from walletconnect button
  disconnetFromWallet = payload => {
    this.state.walletConnector.killSession();
  };

  walletFileUploaded = (fileContents, password) => {
    console.log("Wallet file upload complete");
    this.connectWithPrivateKey(fileContents, password);
  };

  connectWithPrivateKey = (fileContents, password) => {
    let address = connectWithPrivateKey(fileContents, password);
    this.setState({ binanceAddress: address });
    this.setState({ connected: true });
    this.setState({ file: fileContents });
    this.setState({ password: password });
    this.initBinanceWorkflow(address);
  };

  getTotalUsdValue = () => {
    if (this.state.binanceAssets === null) {
      return 0;
    }

    let totalUsdValue = 0;
    this.state.binanceAssets.forEach(asset => {
      if (asset.myBalance !== 0) {
        totalUsdValue += asset.currentUsdPrice * asset.myBalance;
      }
    });

    return totalUsdValue;
  };

  settingsToggle = () => {
    this.setState({
      settingsModal: !this.state.settingsModal
    });
  };

  shareToggle = () => {
    let shareLink = generateShareLink(
      this.props.development,
      this.state.binanceAssets
    );
    this.setState({
      shareLink: shareLink
    });
    this.setState({
      rebalanceModal: false
    });
    this.setState({
      shareModal: !this.state.shareModal
    });
  };

  getTotalCurrentPercentage = () => {
    let totalPercentage = 0;

    this.state.binanceAssets.forEach(bnbAsset => {
      totalPercentage += bnbAsset.newPortfolioPercent;
    });

    return totalPercentage;
  };

  handleSelect = e => {
    const binanceAssets = [...this.state.binanceAssets];

    let element = binanceAssets.find(
      bnbAsset => bnbAsset.friendlyName === e.target.value
    );

    if (element === null || element === undefined) {
      return;
    }

    element.inMyPortfolio = true;
    this.setState({ binanceAssets: this.state.binanceAssets });
  };

  changeSlider = (asset, value) => {
    const binanceAssets = [...this.state.binanceAssets];
    let element;

    element = binanceAssets.find(
      bnbAsset => bnbAsset.baseAssetName === asset.imageSymbol
    );

    if (element === undefined || element === null) {
      element = binanceAssets.find(
        bnbAsset => bnbAsset.baseAssetName === asset.baseAssetName
      );
    }

    let totalPercentage = 0;

    element.newPortfolioPercent = value;

    binanceAssets.forEach(bnbAsset => {
      totalPercentage += bnbAsset.newPortfolioPercent;
    });

    if (totalPercentage > 100) {
      element.newPortfolioPercent = value - (totalPercentage - 100);
    } else {
      element.newPortfolioPercent = value;
    }

    this.setState({ binanceAssets: this.state.binanceAssets });
  };

  reset = async () => {
    let file = this.state.file;
    let password = this.state.password;
    let walletConnector = this.state.walletConnector;

    await this.setState({ ...INITIAL_STATE });

    if (walletConnector === null || walletConnector === undefined) {
      this.connectWithPrivateKey(file, password);
    } else {
      this.init(true);
    }
  };

  startComparePortfolioTrade = () => {
    console.log("start Compare Portfolio Trade");
    this.state.binanceAssets.forEach(asset => {
      if (
        this.state.portfolioCompareAssets.some(
          portfolioAsset => portfolioAsset.baseAssetName === asset.baseAssetName
        )
      ) {
        asset.inMyPortfolio = true;
        asset.newPortfolioPercent = this.state.portfolioCompareAssets.filter(
          portfolioAsset => portfolioAsset.baseAssetName === asset.baseAssetName
        )[0].currentPortfolioPercent;
      } else {
        asset.newPortfolioPercent = 0;
      }
    });

    this.startTrade();
  };

  startTrade = () => {
    let trades = computeTrades(this.state.binanceAssets);
    let confirmations = [];

    for (let i = 0; i < trades.length; i++) {
      let confirmationShell = { complete: false };
      confirmations.push(confirmationShell);
    }

    this.setState({ currentTrades: trades });
    this.setState({ confirmations: confirmations });

    this.toggleRebalanceModal();

    tradeOnBnbChain(
      trades,
      this.state.binanceAddress,
      this.state.binanceAssets,
      this.confirmationCallback,
      this.state.walletConnector
    );
  };

  toggleRebalanceModal = () => {
    this.setState({
      rebalanceModal: !this.state.rebalanceModal
    });
  };

  dummyCountdown = () => {
    this.setTimeout(this.startCountdownConfirmations, 2000);
    this.setTimeout(this.startCountdownConfirmations, 4000);
    this.setTimeout(this.startCountdownConfirmations, 6000);
    this.setTimeout(this.startCountdownConfirmations, 7000);
  };

  startCountdownConfirmations = () => {
    let confirmations = this.state.confirmations;

    for (let i = 0; i < confirmations.length; i++) {
      if (confirmations[i] === false) {
        confirmations[i] = true;
        this.setState({
          confirmations: confirmations
        });
        return;
      }
    }
  };

  confirmationCallback = async confimation => {
    const sleep = milliseconds => {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    let confs = this.state.confirmations;

    if (confimation.error === "lotSizeError") {
      for (let i = 0; i < confs.length; i++) {
        if (confs[i].complete === false) {
          confs[i].complete = true;
          confs[i].error = true;
          confs[i].url = "Need Bigger Lot Size";
          this.setState({
            confirmations: confs
          });
          return;
        }
      }
    }

    if (
      confimation.error !== undefined ||
      confimation === undefined ||
      confimation.result === undefined ||
      confimation.result[0] === undefined
    ) {
      console.log(" catch all error ");
      for (let i = 0; i < confs.length; i++) {
        if (confs[i].complete === false) {
          confs[i].complete = true;
          confs[i].error = true;
          confs[i].url = "Need Bigger Lot Size";
          this.setState({
            confirmations: confs
          });
          return;
        }
      }
    }

    //https://explorer.binance.org/tx/161EABE0CB619BE642757E20A544BA95341F6FB0F8576D3A841421128C576596

    let orderId = JSON.parse(confimation.result[0].data).order_id;

    let orderDetails;
    orderDetails = await axios.get(
      `https://dex.binance.org/api/v1/orders/${orderId}`
    );

    if (orderDetails.data === "" || orderDetails.data === undefined) {
      await sleep(1000);
      orderDetails = await axios.get(
        `https://dex.binance.org/api/v1/orders/${orderId}`
      );
    }

    for (let i = 0; i < confs.length; i++) {
      if (confs[i].complete === false) {
        confs[i].complete = true;
        confs[i].error = false;
        confs[
          i
        ].url = `https://explorer.binance.org/tx/${orderDetails.data.transactionHash}`;
        this.setState({
          confirmations: confs
        });
        return;
      }
    }
  };

  clickSharePortfolio = () => {
    console.log(this.state.binanceAssets);
  };

  parseHref = async () => {
    let portfolioAssets = [];
    let baseAssetNameMap = new Map();
    let symbolMap = new Map();

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
    });

    console.log(currentPrices);

    // http://binance.localhost:3000/portfolio/bnb_and_raven_tokenfolio-bnb_50-raven_50
    let lastSlashIndex = window.location.href.lastIndexOf("/portfolio/");

    if (lastSlashIndex === -1) {
      return;
    }

    lastSlashIndex += 11;

    let portfolioEnding = window.location.href.substring(
      lastSlashIndex,
      window.location.href.length
    );

    portfolioEnding = portfolioEnding.replace("#", "");

    let chunks = portfolioEnding.split("-");

    // let index = 0;
    chunks.forEach((chunk, index) => {
      console.log(chunk);
      if (index === 0) {
        let nameChunks = chunk.split("_");
        let portfolioName = "";
        for (let i = 0; i < nameChunks.length; i++) {
          nameChunks[i] = setCharAt(
            nameChunks[i],
            0,
            nameChunks[i].charAt(0).toUpperCase()
          );

          portfolioName += nameChunks[i];

          if (i !== nameChunks.length - 1) {
            portfolioName += " ";
          }
        }
        this.setState({ comparePortfolioName: portfolioName });
      } else {
        let assetAndPercent = chunk.split("_");
        let assetOne = {
          baseAssetName: baseAssetNameMap.get(assetAndPercent[0].toUpperCase()),
          friendlyName: assetAndPercent[0].toUpperCase(),
          currentPortfolioPercent: parseInt(assetAndPercent[1]),
          inMyPortfolio: true
        };

        portfolioAssets.push(assetOne);
      }
    });

    console.log("parsed assets");
    console.log(portfolioAssets);

    this.setState({ comparePortfolio: true });
    this.setState({ portfolioCompareAssets: portfolioAssets });
  };

  render() {
    let moduleToRender;

    // Connect To Wallet Module
    if (!this.state.connected) {
      moduleToRender = (
        <ConnectionScreen
          clickWalletConnect={this.clickWalletConnect}
          walletFileUploaded={this.walletFileUploaded}
          binanceAssets={this.state.binanceAssets}
          getTotalUsdValue={this.getTotalUsdValue}
        />
      );
    }

    if (this.state.connected) {
      moduleToRender = (
        <RebalancePortfolioScreen
          handleSelect={this.handleSelect}
          binanceAssets={this.state.binanceAssets}
          getTotalUsdValue={this.getTotalUsdValue}
          getTotalCurrentPercentage={this.getTotalCurrentPercentage}
          changeSlider={this.changeSlider}
          startTrade={this.startTrade}
          settingsToggle={this.settingsToggle}
          clickSharePortfolio={this.clickSharePortfolio}
          shareToggle={this.shareToggle}
          // shareLink={this.state.shareLink}
        />
      );
    }

    if (this.state.connected && this.state.comparePortfolio) {
      moduleToRender = (
        <ComparePortfolioScreen
          convertToPortfolioAssets={this.state.portfolioCompareAssets}
          binanceAssets={this.state.binanceAssets}
          getTotalUsdValue={this.getTotalUsdValue}
          getTotalCurrentPercentage={this.getTotalCurrentPercentage}
          comparePortfolioName={this.state.comparePortfolioName}
          startComparePortfolioTrade={this.startComparePortfolioTrade}
          settingsToggle={this.settingsToggle}
          clickSharePortfolio={this.clickSharePortfolio}
        />
      );
    }

    return (
      <MDBContainer className="h-100 custom-bg-ellipses">
        {/* Share Modal */}
        <ShareModal
          toggle={this.shareToggle}
          modal={this.state.shareModal}
          shareLink={this.state.shareLink}
        />

        {/* Settings modal */}
        <MDBModal
          isOpen={this.state.settingsModal}
          toggle={this.settingsToggle}
          centered
        >
          <MDBModalHeader>Settings</MDBModalHeader>
          <MDBModalBody>
            <MDBRow className="h-100 align-items-center">
              <MDBCol
                style={{
                  textAlign: "center",
                  paddingTop: "40px"
                }}
              >
                <MDBBtn
                  onClick={this.clickWalletConnectDisconnect}
                  color="indigo"
                >
                  Disconnect WalletConnect
                </MDBBtn>
              </MDBCol>
            </MDBRow>

            <MDBRow className="h-100 align-items-center">
              <MDBCol
                style={{
                  textAlign: "center",
                  paddingTop: "40px"
                }}
              >
                <a href="https://tokenfolio.cc"> Switch To Ethereum Chain </a>
              </MDBCol>
            </MDBRow>
          </MDBModalBody>
        </MDBModal>

        <RebalanceModal
          reset={this.reset}
          currentTrades={this.state.currentTrades}
          confirmations={this.state.confirmations}
          toggle={this.toggleRebalanceModal}
          modal={this.state.rebalanceModal}
          clickSharePortfolio={this.clickSharePortfolio}
          shareToggle={this.shareToggle}
        />

        {/* Main Module */}
        <MDBRow className="h-100 align-items-center">
          {/* Start of rendering */}
          {moduleToRender}
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Tokenfolio;
