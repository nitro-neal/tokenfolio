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
  MDBIcon,
  Animation
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

class ComparePortfolioScreenWithAnimation extends Component {
  state = {};

  changeSlider = () => {
    console.log("slider change");
  };

  componentDidMount() {
    this.animateSliderToMatch();
  }

  animateSliderToMatch = async () => {
    const sleep = milliseconds => {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    // newAssets.forEach(asset => {
    //   //asset.inMyPortfolio = true;
    //   for (let i = 0; i < this.props.binanceAssets.length; i++) {
    //     if(this.props.binanceAssets[i].)
    //   }
    // });

    await sleep(2000);

    this.props.binanceAssets.forEach(asset => {
      this.props.convertToPortfolioAssets.forEach(convertToAsset => {
        if (asset.baseAssetName === convertToAsset.baseAssetName) {
          asset.inMyPortfolio = true;
          let step =
            (asset.currentPortfolioPercent -
              convertToAsset.currentPortfolioPercent) /
            100.0;
          asset.step = step;
          asset.stepPercentage = asset.currentPortfolioPercent;
        }
      });
    });

    this.props.binanceAssets.forEach(asset => {
      if (asset.inMyPortfolio) {
        if (asset.step === undefined) {
          // going to 0
          let step = asset.currentPortfolioPercent / 100.0;
          asset.step = step;
          asset.stepPercentage = asset.currentPortfolioPercent;
        }
        console.log(asset);
      }
    });

    await sleep(2000);
    console.log("change slider");

    let bnbAsset = this.props.binanceAssets.filter(
      asset => asset.symbol === "BNB_USDSB-1AC"
    )[0];
    console.log(bnbAsset);

    let currentPercentage = bnbAsset.currentPortfolioPercent;
    let wantedPercentage = 10.0;

    let step = (currentPercentage - wantedPercentage) / 100.0;

    console.log(currentPercentage);
    console.log(step);

    let startTime = new Date();

    for (let i = 0; i < 100; i++) {
      await sleep(20);
      this.props.binanceAssets.forEach(asset => {
        if (asset.inMyPortfolio) {
          asset.stepPercentage = asset.stepPercentage - asset.step;
          // console.log(currentPercentage);
          this.props.changeSlider(asset, asset.stepPercentage);
        }
      });
    }

    let endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    let seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
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

        <MDBRow className="h-100 align-items-center">
          <MDBCol md="5">
            <MDBRow className="h-100 align-items-center">
              <MDBCol>
                <AssetSliders
                  totalUsdValue={this.props.getTotalUsdValue()}
                  totalPercentage={this.props.getTotalCurrentPercentage()}
                  changeSlider={this.props.changeSlider}
                  binanceAssets={this.props.convertToPortfolioAssets}
                />
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBCol md="2">
            <Animation type="pulse" infinite>
              <MDBRow className="h-100 align-items-center">
                <MDBCol md="4"></MDBCol>
                <MDBCol md="2">
                  <MDBIcon size="3x" far icon="arrow-alt-circle-right" />
                </MDBCol>
                <MDBCol md="6"></MDBCol>
              </MDBRow>
            </Animation>
          </MDBCol>
          <MDBCol md="5">
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
      </div>
    );
  }
}

export default ComparePortfolioScreenWithAnimation;
