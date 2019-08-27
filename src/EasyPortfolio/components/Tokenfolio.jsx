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

const INITIAL_STATE = {
  file: null,
  password: null,
  binanceWorkflow: false,
  walletConnector: null,
  binanceAssets: [],
  binanceAddress: "",
  rebalanceModal: false,
  currentTrades: [],
  confirmations: [],
  connected: false,
  development: false,
  settingsModal: false,
  comparePortfolio: true
};

class Tokenfolio extends Component {
  state = { ...INITIAL_STATE };

  componentDidMount() {
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

    element.inMyPortfolio = true;
    this.setState({ binanceAssets: this.state.binanceAssets });
  };

  changeSlider = (asset, value) => {
    const binanceAssets = [...this.state.binanceAssets];
    let element = binanceAssets.find(
      bnbAsset => bnbAsset.baseAssetName === asset.imageSymbol
    );

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
        />
      );
    }

    if (this.state.connected && this.state.comparePortfolio) {
      moduleToRender = (
        <ComparePortfolioScreen
          handleSelect={this.handleSelect}
          binanceAssets={this.state.binanceAssets}
          getTotalUsdValue={this.getTotalUsdValue}
          getTotalCurrentPercentage={this.getTotalCurrentPercentage}
          changeSlider={this.changeSlider}
          startTrade={this.startTrade}
          settingsToggle={this.settingsToggle}
        />
      );
    }

    return (
      <MDBContainer className="h-100 custom-bg-ellipses">
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
