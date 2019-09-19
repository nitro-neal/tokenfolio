import React, { Component } from "react";

import {
  MDBRow,
  MDBCol,
  MDBAnimation,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBIcon,
  Animation
} from "mdbreact";
import Footer from "./Footer";

const centerText = {
  textAlign: "center"
};

const imageStyle = { width: "50px", paddingRight: "10px" };

const animationTypeLeft = "flipInX";

const centerWithTopPadding = {
  textAlign: "center",
  paddingTop: "40px"
};

const paddingLeft = {
  paddingLeft: "20px"
};

class ComparePortfolioScreen extends Component {
  state = {};
  render() {
    if (
      this.props.binanceAssets === undefined ||
      this.props.binanceAssets === null ||
      this.props.binanceAssets.length === 0
    ) {
      return "";
    }

    let rebalanceRows = [];

    console.log("convert assets?");
    console.log(this.props.convertToPortfolioAssets);
    // ADD BNB FIRST...
    this.props.binanceAssets.forEach(asset => {
      if (asset.baseAssetName === "BNB" && asset.inMyPortfolio) {
        let toPercent = 0.0;
        if (
          this.props.convertToPortfolioAssets.filter(
            portfolioAsset =>
              portfolioAsset.baseAssetName === asset.baseAssetName
          ).length > 0
        ) {
          toPercent = this.props.convertToPortfolioAssets.filter(
            portfolioAsset =>
              portfolioAsset.baseAssetName === asset.baseAssetName
          )[0].currentPortfolioPercent;
        }
        rebalanceRows.push(
          <MDBAnimation key={asset.baseAssetName} type={animationTypeLeft}>
            <MDBRow style={centerText}>
              <MDBCol size={"9"}>
                <p style={{ textAlign: "left" }}>
                  <img
                    alt={asset.baseAssetName}
                    style={imageStyle}
                    src={"/logos/" + asset.baseAssetName.toLowerCase() + ".png"}
                  />
                  {asset.realName} ({asset.friendlyName})
                </p>
              </MDBCol>
              <MDBCol size={"1"}>
                <p>{Math.round(asset.currentPortfolioPercent)}%</p>
              </MDBCol>
              <MDBCol size={"1"}>
                <MDBIcon icon="angle-double-right" />
              </MDBCol>
              <MDBCol size={"1"}>
                <p>{toPercent}%</p>
              </MDBCol>
            </MDBRow>
          </MDBAnimation>
        );
      }
    });

    // ADD the rest
    this.props.binanceAssets.forEach(asset => {
      if (
        this.props.convertToPortfolioAssets.some(
          portfolioAsset =>
            portfolioAsset.baseAssetName === asset.baseAssetName ||
            asset.inMyPortfolio
        ) &&
        asset.baseAssetName !== "BNB"
      ) {
        let toPercent = 0.0;
        if (
          this.props.convertToPortfolioAssets.filter(
            portfolioAsset =>
              portfolioAsset.baseAssetName === asset.baseAssetName
          ).length > 0
        ) {
          toPercent = this.props.convertToPortfolioAssets.filter(
            portfolioAsset =>
              portfolioAsset.baseAssetName === asset.baseAssetName
          )[0].currentPortfolioPercent;
        }
        rebalanceRows.push(
          <MDBAnimation key={asset.baseAssetName} type={animationTypeLeft}>
            <MDBRow style={centerText}>
              <MDBCol size={"9"}>
                <p style={{ textAlign: "left" }}>
                  <img
                    alt={asset.baseAssetName}
                    style={imageStyle}
                    src={"/logos/" + asset.baseAssetName.toLowerCase() + ".png"}
                  />
                  {asset.realName} ({asset.friendlyName})
                </p>
              </MDBCol>
              <MDBCol size={"1"}>
                <p>{Math.round(asset.currentPortfolioPercent)}%</p>
              </MDBCol>
              <MDBCol size={"1"}>
                <Animation type="pulse" infinite>
                  <MDBIcon icon="angle-double-right" />
                </Animation>
              </MDBCol>
              <MDBCol size={"1"}>
                <p>{toPercent}%</p>
              </MDBCol>
            </MDBRow>
          </MDBAnimation>
        );
      }
    });

    return (
      <div>
        <MDBRow className="h-100 align-items-center">
          <MDBCol md="4"></MDBCol>
          <MDBCol md="4">
            <a href="/">
              <img
                className="img-fluid"
                alt="Tokenfolio logo"
                src="/tflogo.png"
              />
            </a>
          </MDBCol>
          <MDBCol md="4"></MDBCol>
        </MDBRow>

        <MDBRow className="h-100 align-items-center">
          <MDBCol md="3"></MDBCol>
          <MDBCol md="6">
            <p style={{ padding: "7px", textAlign: "center" }}>
              Your current allocation vs "{this.props.comparePortfolioName}"
            </p>
          </MDBCol>
          <MDBCol md="3"></MDBCol>
        </MDBRow>

        <MDBRow className="h-100 align-items-center">
          <MDBCol md="3"></MDBCol>
          <MDBCol md="6">{rebalanceRows}</MDBCol>
          <MDBCol md="3"></MDBCol>
        </MDBRow>

        <MDBRow className="h-100 align-items-center">
          <MDBCol style={centerWithTopPadding}>
            <div style={paddingLeft}>
              <MDBBtn
                data-toggle="rebalanceModal"
                data-target="#exampleModalCenter"
                disabled={this.props.getTotalCurrentPercentage() < 99.9}
                onClick={this.props.startComparePortfolioTrade}
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

        <Footer clickSharePortfolio={this.props.clickSharePortfolio} />
      </div>
    );
  }
}

export default ComparePortfolioScreen;
