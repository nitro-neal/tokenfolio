import React, { Component } from "react";

import {
  MDBRow,
  MDBCol,
  MDBAnimation,
  MDBBtn,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBNavLink
} from "mdbreact";

import PieChart from "./PieChart";
import AssetSliders from "./AssetSliders";

import SelectDropdown from "./SelectDropdown";
import Footer from "./Footer";
import Globals from "./Globals";

const textAlignCenter = {
  textAlign: "center"
};

const centerWithTopPadding = {
  textAlign: "center",
  paddingTop: "40px"
};

const animationTypeLeft = "flipInX";
const animationTypeRight = "flipInX";

class RebalancePortfolioScreen extends Component {
  render() {
    if (
      this.props.binanceAssets === undefined ||
      this.props.binanceAssets === null ||
      this.props.binanceAssets.length === 0
    ) {
      return "";
    }

    let rebalanceButton;

    if (this.props.getTotalCurrentPercentage() < 99.9) {
      rebalanceButton = (
        <MDBPopover placement="top" popover clickable id="popper1">
          <MDBBtn
            data-toggle="rebalanceModal"
            data-target="#exampleModalCenter"
            // disabled={this.props.getTotalCurrentPercentage() < 99.9}
            // onClick={this.props.startTrade}
            color="indigo"
          >
            Rebalance
          </MDBBtn>
          <div>
            <MDBPopoverHeader>Need 100% Alloication</MDBPopoverHeader>
            <MDBPopoverBody>
              <p>
                Please drag your sliders until you have 100% of your portfolio
                allocated.{" "}
              </p>

              <p>
                Current allowication:{" "}
                {Math.round(this.props.getTotalCurrentPercentage())} %
              </p>
            </MDBPopoverBody>
          </div>
        </MDBPopover>
      );
    } else {
      rebalanceButton = (
        <MDBBtn
          data-toggle="rebalanceModal"
          data-target="#exampleModalCenter"
          // disabled={this.props.getTotalCurrentPercentage() < 99.9}
          onClick={this.props.startTrade}
          color="indigo"
        >
          Rebalance
        </MDBBtn>
      );
    }

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
            <p style={Globals.centerWithBottomPadding}>
              Or view other's <a href="/portfolios/">portfolios</a>
            </p>
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
            {rebalanceButton}

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
          </MDBCol>
        </MDBRow>
      </>
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
        <MDBAnimation type={animationTypeRight}>
          {rebalanceModule}
          <Footer
            clickSharePortfolio={this.props.clickSharePortfolio}
            shareToggle={this.props.shareToggle}
          />
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
