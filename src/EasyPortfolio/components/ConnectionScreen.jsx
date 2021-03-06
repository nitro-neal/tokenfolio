import React, { Component } from "react";

import {
  MDBRow,
  MDBCol,
  MDBAnimation,
  MDBCard,
  MDBCardBody,
  MDBCardTitle
} from "mdbreact";

import PieChart from "./PieChart";
import WalletSelector from "./WalletSelector";
import Footer from "./Footer";

const textAlignCenter = {
  textAlign: "center"
};

const centerWithTopPadding = {
  textAlign: "center",
  paddingTop: "40px"
};

const walletSelectorCard = {
  width: "62rem",
  height: "24rem",
  marginTop: "1rem"
};

const animationTypeLeft = "flipInX";
const animationTypeRight = "flipInX";

class ConnectionScreen extends Component {
  render() {
    let connectModule = (
      <MDBRow className="h-100 align-items-center">
        <MDBCard style={walletSelectorCard}>
          <MDBCardBody>
            <MDBCardTitle>Unlock Your Wallet</MDBCardTitle>
            <MDBCol>
              <WalletSelector
                clickWalletConnect={this.props.clickWalletConnect}
                walletFileUploaded={this.props.walletFileUploaded}
              />
            </MDBCol>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    );

    let leftSide = (
      <MDBCol md="4">
        <MDBAnimation type={animationTypeLeft}>
          <div className="logo">
            <img
              className="img-fluid"
              alt="Tokenfolio logo"
              src="/tflogo.png"
            />

            <PieChart assets={this.props.binanceAssets} />

            <p style={textAlignCenter}>
              USD Value: $
              {Math.round(this.props.getTotalUsdValue() * 100) / 100}
            </p>
          </div>
        </MDBAnimation>
      </MDBCol>
    );

    let rightSide = (
      <MDBCol md="8">
        <MDBAnimation type={animationTypeRight}>{connectModule}</MDBAnimation>
        <Footer
          clickSharePortfolio={this.props.clickSharePortfolio}
          shareToggle={this.props.shareToggle}
        />
      </MDBCol>
    );
    return (
      <>
        {leftSide}
        {rightSide}
      </>
    );
  }
}
export default ConnectionScreen;
