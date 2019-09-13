import React, { Component } from "react";
import {
  MDBJumbotron,
  MDBBtn,
  MDBContainer,
  MDBCol,
  MDBAnimation,
  MDBRow,
  Animation,
  MDBIcon
} from "mdbreact";
import PieChart from "./PieChart";
import Globals from "./Globals";

const imageStyle = { width: "50px", paddingRight: "10px" };

class PortfolioJumbotron extends Component {
  state = {};

  render() {
    let portfolioRows = [];

    if (this.props.assets === null || this.props.assets.length === 0) {
      return <p>loading..</p>;
    }

    console.log(this.props.assets);
    this.props.assets.forEach(asset => {
      portfolioRows.push(
        <MDBAnimation key={asset.baseAssetName} type="flipInX">
          <MDBRow style={Globals.textAlignCenter}>
            <MDBCol size={"9"}>
              <p style={{ textAlign: "left" }}>
                <img
                  alt={asset.baseAssetName}
                  style={imageStyle}
                  src={"/logos/" + asset.baseAssetName.toLowerCase() + ".png"}
                />
                {asset.realName} - ({asset.percentGain}%)
              </p>
            </MDBCol>
            <MDBCol size={"3"}>
              <p>{Math.round(asset.newPortfolioPercent)}%</p>
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
              {/* <p className="lead">
                This is a simple hero unit, a simple Jumbotron-style component
                for calling extra attention to featured content or information.
              </p> */}
              <hr className="my-2" />

              <MDBRow className="h-100 align-items-center">
                <MDBCol size={"6"}>
                  <PieChart assets={this.props.assets} />
                </MDBCol>

                <MDBCol size={"6"}>{portfolioRows}</MDBCol>
              </MDBRow>

              <p className="lead">
                <MDBBtn color="primary">Learn More</MDBBtn>
              </p>
            </MDBJumbotron>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default PortfolioJumbotron;
