import React, { Component } from "react";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBAnimation } from "mdbreact";

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
import PieChart from "./PieChart";
import AssetSliders from "./AssetSliders";
import SelectDropdown from "./SelectDropdown";
import RebalanceModal from "./RebalanceModal";

import WalletSelector from "./WalletSelector";

const textAlignCenter = {
  textAlign: "center"
};

const centerWithTopPadding = {
  textAlign: "center",
  paddingTop: "40px"
};

const paddingLeft = {
  paddingLeft: "20px"
};

const animationTypeLeft = "flipInX";
const animationTypeRight = "flipInX";

class Tokenfolio extends Component {
  state = {
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
    development: false
  };

  componentDidMount() {
    this.init(this.props.binanceWorkflow);
    this.setState({ binanceWorkflow: this.props.binanceWorkflow });
    this.setState({ development: this.props.development });
  }

  init = async binanceWorkflow => {
    if (binanceWorkflow) {
      this.setState({ connected: isWalletConnected() });

      if (isWalletConnected()) {
        await this.connectToWallet();
      } else {
        // show login screen
      }

      if (this.state.walletConnector && this.state.walletConnector.connected) {
        this.initBinanceWorkflow(this.state.walletConnector.accounts[0]);
      }
    } else {
      console.log("init with ethereum workflow");
    }
  };

  initBinanceWorkflow = async address => {
    console.log("init " + address);
    let binanceAssets = await getBnbBalncesAndMarkets(address);
    this.setState({ binanceAssets: binanceAssets });
    this.setState({ binanceAddress: address });
  };

  connectToWallet = async () => {
    let walletConnector = await walletConnectInit(this.walletHasConnected);
    this.setState({ walletConnector: walletConnector });
  };

  disconnetFromoWallet = payload => {
    this.state.walletConnector.killSession();

    // TODO: Have callback to refresh page
  };

  walletFileUploaded = (fileContents, password) => {
    console.log("wallet file upload complete");
    this.connectWithPrivateKey(fileContents, password);
  };

  connectWithPrivateKey = (fileContents, password) => {
    let address = connectWithPrivateKey(fileContents, password);
    this.setState({ binanceAddress: address });
    this.setState({ connected: true });
    this.initBinanceWorkflow(address);
  };

  walletHasConnected = payload => {
    WalletConnectQRCodeModal.close();

    console.log("my paylaod");
    console.log("TODO: set address and wallet connector");

    this.initBinanceWorkflow();
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

  startTrade = () => {
    let trades = computeTrades(this.state.binanceAssets);
    let confirmations = [];

    for (let i = 0; i < trades.length; i++) {
      confirmations.push(false);
    }

    this.setState({ currentTrades: trades });
    this.setState({ confirmations: confirmations });

    this.toggleRebalanceModal();

    tradeOnBnbChain(
      trades,
      this.state.binanceAddress,
      this.state.binanceAssets,
      this.confirmationCallback
    );

    setTimeout(this.startCountdownConfirmations, 2000);
    setTimeout(this.startCountdownConfirmations, 4000);
    setTimeout(this.startCountdownConfirmations, 6000);
    setTimeout(this.startCountdownConfirmations, 7000);
  };

  toggleRebalanceModal = () => {
    this.setState({
      rebalanceModal: !this.state.rebalanceModal
    });
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

  confirmationCallback = confimation => {
    //https://explorer.binance.org/tx/161EABE0CB619BE642757E20A544BA95341F6FB0F8576D3A841421128C576596
    console.log("tokenfolio callback");
    //works
    // console.log(confimation.result[0].data);
  };
  render() {
    return (
      <MDBContainer className="h-100 custom-bg-ellipses">
        <RebalanceModal
          currentTrades={this.state.currentTrades}
          confirmations={this.state.confirmations}
          toggle={this.toggleRebalanceModal}
          modal={this.state.rebalanceModal}
        />
        <MDBRow className="h-100 align-items-center">
          <MDBCol md="4">
            <MDBAnimation type={animationTypeLeft}>
              <div className="logo">
                <img
                  className="img-fluid"
                  alt="Tokenfolio logo"
                  src="tflogo.png"
                />

                <PieChart assets={this.state.binanceAssets} />

                <p style={textAlignCenter}>
                  USD Value: ${Math.round(this.getTotalUsdValue() * 100) / 100}
                </p>
              </div>
            </MDBAnimation>
          </MDBCol>

          <MDBCol md="8">
            <MDBAnimation type={animationTypeRight}>
              {!this.state.connected ? (
                <MDBRow className="h-100 align-items-center">
                  <MDBCol>
                    <WalletSelector
                      walletFileUploaded={this.walletFileUploaded}
                    />
                  </MDBCol>
                </MDBRow>
              ) : (
                <>
                  <MDBRow className="h-100 align-items-center">
                    <MDBCol>
                      <SelectDropdown
                        handleSelect={this.handleSelect}
                        binanceAssets={this.state.binanceAssets}
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow className="h-100 align-items-center">
                    <MDBCol>
                      <AssetSliders
                        totalUsdValue={this.getTotalUsdValue()}
                        totalPercentage={this.getTotalCurrentPercentage()}
                        changeSlider={this.changeSlider}
                        binanceAssets={this.state.binanceAssets}
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow className="h-100 align-items-center">
                    <MDBCol style={centerWithTopPadding}>
                      <div style={paddingLeft}>
                        <MDBBtn
                          data-toggle="rebalanceModal"
                          data-target="#exampleModalCenter"
                          disabled={this.getTotalCurrentPercentage() !== 100}
                          onClick={this.startTrade}
                          color="indigo"
                        >
                          Rebalance
                        </MDBBtn>
                      </div>
                    </MDBCol>
                  </MDBRow>
                </>
              )}

              <MDBRow className="h-100 align-items-center">
                <MDBCol style={centerWithTopPadding}>
                  <p>
                    Powered by
                    <a
                      rel="noopener noreferrer"
                      href="https://www.binance.org/"
                      target="_blank"
                    >
                      {" "}
                      Binance Chain
                    </a>
                  </p>
                </MDBCol>
              </MDBRow>
            </MDBAnimation>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Tokenfolio;
