import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

import React from "react";
import Slider from "rc-slider";

import { MDBContainer, MDBRow, MDBCol, MDBAnimation } from "mdbreact";

const wrapperStyle = { marginLeft: "15%", marginRight: "15%" };
const imageStyle = { width: "30px" };
var colorMap = new Map();

class AssetSliders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    colorMap.set("BTC", { backgroundColor: "orange", borderColor: "orange" });
    colorMap.set("WBTC", { backgroundColor: "orange", borderColor: "orange" });
    colorMap.set("ETH", { backgroundColor: "#12100B", borderColor: "#12100B" });
    colorMap.set("BAT", { backgroundColor: "red", borderColor: "red" });
    colorMap.set("DAI", { backgroundColor: "yellow", borderColor: "yellow" });
    colorMap.set("OMG", { backgroundColor: "blue", borderColor: "blue" });
    colorMap.set("MANA", { backgroundColor: "green", borderColor: "green" });

    colorMap.set("BNB", { backgroundColor: "yellow", borderColor: "yellow" });
    colorMap.set("FTM", { backgroundColor: "blue", borderColor: "blue" });
  }

  render() {
    var myStyle = { backgroundColor: "grey" };
    var textAlignRight = { textAlign: "right" };
    var textAlignRightAndRed = { textAlign: "right", color: "red" };
    var textAlignLeft = { textAlign: "left" };
    var animationTypeRight = "flipInX";

    let prunedAssets = this.props.binanceAssets.filter(
      asset => asset.inMyPortfolio === true
    );

    let sortedAssets = prunedAssets.map(function(asset) {
      let n = asset.baseAssetName.indexOf("-");
      let nLogo = asset.symbol.indexOf("_");
      return {
        symbol: asset.baseAssetName.substring(
          0,
          n !== -1 ? n : asset.baseAssetName.length
        ),
        newPortfolioPercent: asset.newPortfolioPercent,
        imageSymbol: asset.symbol.substring(
          0,
          nLogo !== -1 ? nLogo : asset.symbol.length
        )
      };
    });

    sortedAssets.sort(function(a, b) {
      if (a.symbol === "BNB" || b.symbol === "BNB") {
        return 1;
      }
      if (a.symbol < b.symbol) {
        return -1;
      }
      if (a.symbol > b.symbol) {
        return 1;
      }
      return 0;
    });

    let bnbAssetIndex = sortedAssets.findIndex(asset => asset.symbol === "BNB");

    if (bnbAssetIndex !== -1) {
      sortedAssets.unshift(sortedAssets[bnbAssetIndex]);
      sortedAssets.splice(bnbAssetIndex + 1, 1);
    }

    //sortedAssets.unshift({ symbol: "BNB", newPortfolioPercent: "" });

    var items = [];
    sortedAssets.forEach(asset => {
      var computedValue = asset.newPortfolioPercent;

      items.push(
        <MDBContainer key={asset.symbol}>
          <MDBAnimation key={asset.symbol} type={animationTypeRight}>
            <div key={asset.symbol}>
              <MDBRow>
                <MDBCol size={"2"}>
                  {" "}
                  <img
                    alt=""
                    style={imageStyle}
                    src={"./logos/" + asset.imageSymbol.toLowerCase() + ".png"}
                  />{" "}
                </MDBCol>
                <MDBCol size={"7"}>
                  {" "}
                  <p style={textAlignLeft} className="herotext">
                    {" "}
                    {asset.tokenName} ({asset.symbol}){" "}
                  </p>
                </MDBCol>
                <MDBCol size={"3"}>
                  {" "}
                  <p style={textAlignRight} className="herotext">
                    {" "}
                    {Math.round(asset.newPortfolioPercent)} %{" "}
                  </p>
                </MDBCol>
              </MDBRow>

              <MDBRow>
                <MDBCol>
                  <div key={asset.symbol} style={wrapperStyle}>
                    <Slider
                      trackStyle={colorMap.get(asset.symbol)}
                      handleStyle={colorMap.get(asset.symbol)}
                      railStyle={myStyle}
                      min={0}
                      max={100}
                      defaultValue={5}
                      value={computedValue}
                      onChange={e => this.props.changeSlider(asset, e)}
                    />
                  </div>
                </MDBCol>
              </MDBRow>
            </div>
          </MDBAnimation>
        </MDBContainer>
      );
    });

    if (items.length > 0) {
      items.push(
        <MDBContainer key="total">
          <br />
          <MDBAnimation key="total" type={animationTypeRight}>
            <div key="total">
              <MDBRow>
                <MDBCol size={"2"}> </MDBCol>
                <MDBCol size={"7"}>
                  {" "}
                  <p style={textAlignLeft} className="herotext">
                    {" "}
                    Total{" "}
                  </p>
                </MDBCol>
                {this.props.totalPercentage >= 99.9 ? (
                  <MDBCol size={"3"}>
                    {" "}
                    <p style={textAlignRight} className="herotext">
                      {" "}
                      {Math.round(this.props.totalPercentage)} %{" "}
                    </p>
                  </MDBCol>
                ) : (
                  <MDBCol size={"3"}>
                    {" "}
                    <p style={textAlignRightAndRed} className="herotext">
                      {" "}
                      {Math.round(this.props.totalPercentage)} %{" "}
                    </p>
                  </MDBCol>
                )}
              </MDBRow>
            </div>
          </MDBAnimation>
        </MDBContainer>
      );
    }

    return <div>{items}</div>;
  }
}

export default AssetSliders;
