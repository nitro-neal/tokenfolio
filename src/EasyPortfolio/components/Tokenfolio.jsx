import React, { Component } from "react";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBAnimation,
  MDBAlert,
  Animation,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader
} from "mdbreact";

import { walletConnectInit } from "../helpers/WalletConnectHelper";
import { getBnbBalncesAndMarkets } from "../helpers/BinanceInterface";
import PieChart from "./PieChart";
import AssetSliders from "./AssetSliders";
import SelectDropdown from "./SelectDropdown";

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
    binanceWorkflow: false,
    walletConnector: null,
    binanceAssets: []
  };

  componentDidMount() {
    this.init(this.props.binanceWorkflow);
    this.setState({ binanceWorkflow: this.props.binanceWorkflow });
  }

  init = async binanceWorkflow => {
    if (binanceWorkflow) {
      await this.connectToWallet();
      if (this.state.walletConnector && this.state.walletConnector.connected) {
        this.initBinanceWorkflow();
      }
    } else {
      console.log("init with ethereum workflow");
    }
  };

  initBinanceWorkflow = async () => {
    let binanceAssets = await getBnbBalncesAndMarkets(
      this.state.walletConnector.accounts[0]
    );
    this.setState({ binanceAssets: binanceAssets });
  };

  connectToWallet = async () => {
    let walletConnector = await walletConnectInit(this.walletHasConnected);
    this.setState({ walletConnector: walletConnector });
  };

  disconnetFromoWallet = payload => {
    this.state.walletConnector.killSession();
  };

  walletHasConnected = payload => {
    WalletConnectQRCodeModal.close();
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

  render() {
    return (
      <MDBContainer className="h-100 custom-bg-ellipses">
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
                      data-toggle="modal"
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

          <MDBBtn onClick={this.connectToWallet} color="indigo">
            Connect
          </MDBBtn>
          <MDBBtn onClick={this.disconnetFromoWallet} color="indigo">
            Disconnect
          </MDBBtn>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Tokenfolio;
