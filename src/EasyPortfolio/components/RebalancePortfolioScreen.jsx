import React, { Component } from "react";

import {
  MDBRow,
  MDBCol,
  MDBAnimation,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBIcon
} from "mdbreact";

import PieChart from "./PieChart";
import AssetSliders from "./AssetSliders";
import WalletSelector from "./WalletSelector";
import SelectDropdown from "./SelectDropdown";
import RebalanceModal from "./RebalanceModal";

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

const walletSelectorCard = {
  width: "62rem",
  height: "24rem",
  marginTop: "1rem"
};

const animationTypeLeft = "flipInX";
const animationTypeRight = "flipInX";

class RebalancePortfolioScreen extends Component {
  render() {
    let rebalanceModule = (
      <>
        <MDBRow className="h-100 align-items-center">
          <MDBCol>
            <SelectDropdown
              handleSelect={this.props.handleSelect}
              binanceAssets={this.props.binanceAssets}
            />
          </MDBCol>
        </MDBRow>

        <MDBRow className="h-100 align-items-center">
          <MDBCol>
            <AssetSliders
              totalUsdValue={this.props.getTotalUsdValue()}
              totalPercentage={this.props.getTotalCurrentPercentage()}
              changeSlider={this.props.changeSlider}
              binanceAssets={this.props.binanceAssets}
            />
          </MDBCol>
        </MDBRow>

        <MDBRow className="h-100 align-items-center">
          <MDBCol style={centerWithTopPadding}>
            <div style={paddingLeft}>
              <MDBBtn
                data-toggle="rebalanceModal"
                data-target="#exampleModalCenter"
                disabled={this.props.getTotalCurrentPercentage() < 99.9}
                onClick={this.props.startTrade}
                color="indigo"
              >
                Rebalance
              </MDBBtn>
              <a
                style={{
                  color: "#586b81"
                }}
                href="#"
                onClick={this.props.settingsToggle}
              >
                <MDBIcon
                  style={{
                    verticalAlign: "bottom",
                    paddingBottom: "7px"
                  }}
                  color="#586b81"
                  icon="cog"
                />
              </a>
            </div>
          </MDBCol>
        </MDBRow>
      </>
    );

    let leftSide = (
      <MDBCol md="4">
        <MDBAnimation type={animationTypeLeft}>
          <div className="logo">
            <img className="img-fluid" alt="Tokenfolio logo" src="tflogo.png" />

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
        <MDBAnimation type={animationTypeRight}>
          {rebalanceModule}
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
    );
    return (
      <>
        {leftSide}
        {rightSide}
      </>
    );
  }
}
export default RebalancePortfolioScreen;
