import React, { Component } from "react";
import AssetSliders from "./AssetSliders";

class ComparePortfolio extends Component {
  state = {};

  changeSlider = () => {
    console.log("slider change");
  };
  render() {
    return (
      <div>
        <AssetSliders
          totalUsdValue={this.props.totalUsdValue}
          totalPercentage={this.props.totalPercentage}
          changeSlider={this.changeSlider}
          binanceAssets={this.props.binanceAssets}
        />
        <h1>=></h1>

        <AssetSliders
          totalUsdValue={this.props.totalUsdValue}
          totalPercentage={this.props.totalPercentage}
          changeSlider={this.changeSlider}
          binanceAssets={this.props.binanceAssets}
        />
      </div>
    );
  }
}

export default ComparePortfolio;
