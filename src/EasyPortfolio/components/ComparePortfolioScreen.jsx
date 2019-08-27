import React, { Component } from "react";
import AssetSliders from "./AssetSliders";

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

class ComparePortfolioScreen extends Component {
  state = {};

  changeSlider = () => {
    console.log("slider change");
  };
  render() {
    return (
      <div>
        <MDBRow className="h-100 align-items-center">
          <MDBCol md="4"></MDBCol>
          <MDBCol md="4">
            <img className="img-fluid" alt="Tokenfolio logo" src="tflogo.png" />
          </MDBCol>
          <MDBCol md="4"></MDBCol>
        </MDBRow>

        <MDBRow className="h-100 align-items-center">
          <MDBCol md="6">
            <MDBAnimation type={animationTypeLeft}>
              <div className="logo">
                <p style={textAlignCenter}>Eth / Bat Tokenfolio</p>
                <PieChart assets={this.props.binanceAssets} />
              </div>
            </MDBAnimation>
          </MDBCol>
          <MDBCol md="6">
            <MDBAnimation type={animationTypeLeft}>
              <div className="logo">
                <p style={textAlignCenter}>Your Tokenfolio</p>
                <PieChart assets={this.props.binanceAssets} />

                {/*
                <p style={textAlignCenter}>
                  USD Value: $
                  {Math.round(this.props.getTotalUsdValue() * 100) / 100}
                </p>
                */}
              </div>
            </MDBAnimation>
          </MDBCol>
        </MDBRow>

        <MDBRow className="h-100 align-items-center"></MDBRow>
      </div>
    );
  }
}

export default ComparePortfolioScreen;
