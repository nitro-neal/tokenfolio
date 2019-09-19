import React, { Component } from "react";
import {
  MDBJumbotron,
  MDBBtn,
  MDBContainer,
  MDBCol,
  MDBAnimation,
  MDBRow,
  Animation,
  MDBIcon,
  MDBNavLink
} from "mdbreact";
import PieChart from "./PieChart";
import Globals from "./Globals";

const imageStyle = { width: "50px", paddingRight: "10px" };

class PortfolioJumbotron extends Component {
  state = {};

  render() {
    let keyTitleString = this.props.title.replace(/\s+/g, "_").toLowerCase();
    let link = "/portfolio/" + keyTitleString;

    let portfolioRows = [];

    if (this.props.assets === null || this.props.assets.length === 0) {
      return <p>loading..</p>;
    }

    portfolioRows.push(
      <MDBAnimation key={keyTitleString} type="flipInX">
        <MDBRow style={Globals.textAlignCenter}>
          <MDBCol size={"3"}>
            <p style={{ textAlign: "left" }}></p>
          </MDBCol>
          <MDBCol size={"2"}>
            <p style={{ textAlign: "left" }}>1d</p>
          </MDBCol>
          <MDBCol size={"2"}>
            <p style={{ textAlign: "left" }}>7d</p>
          </MDBCol>
          <MDBCol size={"2"}>
            <p style={{ textAlign: "left" }}>30d</p>
          </MDBCol>
          <MDBCol size={"2"}>
            <p style={{ textAlign: "left" }}>Portfolio %</p>
          </MDBCol>
        </MDBRow>
      </MDBAnimation>
    );
    this.props.assets.forEach(asset => {
      link += "-" + asset.realName + "_" + asset.newPortfolioPercent;
      let colorRedOrGreen1D = asset.percentGainOneDay < 0 ? "red" : "green";
      let colorRedOrGreen7D = asset.percentGainSevenDays < 0 ? "red" : "green";
      let colorRedOrGreen30D =
        asset.percentGainThirtyDays < 0 ? "red" : "green";

      let keyTitleString = this.props.title.replace(/\s+/g, "-").toLowerCase();
      let key = asset.baseAssetName + keyTitleString;
      portfolioRows.push(
        <MDBAnimation key={key} type="flipInX">
          <MDBRow style={Globals.textAlignCenter}>
            <MDBCol size={"3"}>
              <p style={{ textAlign: "left" }}>
                <img
                  alt={asset.baseAssetName}
                  style={imageStyle}
                  src={"/logos/" + asset.baseAssetName.toLowerCase() + ".png"}
                />

                {asset.realName}
              </p>
            </MDBCol>
            <MDBCol size={"2"}>
              <p style={{ textAlign: "left", paddingTop: "7px" }}>
                {" "}
                <span
                  style={{
                    color: colorRedOrGreen1D
                  }}
                >
                  ({asset.percentGainOneDay}%)
                </span>
              </p>
            </MDBCol>
            <MDBCol size={"2"}>
              {" "}
              <p style={{ textAlign: "left", paddingTop: "7px" }}>
                {" "}
                <span
                  style={{
                    color: colorRedOrGreen7D
                  }}
                >
                  ({asset.percentGainSevenDays}%)
                </span>
              </p>
            </MDBCol>
            <MDBCol size={"2"}>
              {" "}
              <p style={{ textAlign: "left", paddingTop: "7px" }}>
                {" "}
                <span
                  style={{
                    color: colorRedOrGreen30D
                  }}
                >
                  (
                  {asset.percentGainThirtyDays === -999
                    ? "N/A"
                    : asset.percentGainThirtyDays}
                  %)
                </span>
              </p>
            </MDBCol>
            <MDBCol size={"3"}>
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  paddingTop: "7px"
                }}
              >
                {Math.round(asset.newPortfolioPercent)}%
              </p>
            </MDBCol>
          </MDBRow>
        </MDBAnimation>
      );
    });

    return (
      <MDBContainer className="mt-5 text-center">
        <MDBRow>
          <MDBCol>
            <MDBJumbotron>
              <h2 className="h1 display-5">{this.props.title}</h2>
              <p className="lead">{this.props.lead}</p>
              <hr className="my-2" />

              <MDBRow className="h-100 align-items-center">
                <MDBCol size={"4"}>
                  <PieChart assets={this.props.assets} />
                </MDBCol>

                <MDBCol size={"8"}>{portfolioRows}</MDBCol>
              </MDBRow>

              <p className="lead">
                <a href={link}>
                  <MDBBtn color="indigo">Rebalance</MDBBtn>
                </a>
              </p>
            </MDBJumbotron>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default PortfolioJumbotron;
