import React from "react";
import Chart from "react-google-charts";

class PieChart extends React.Component {
  colorMap = new Map();

  render() {
    if (this.props.assets === null) {
      return <p> Loading Chart.. </p>;
    }

    const blueColors = [];
    blueColors.push("#16194e");
    blueColors.push("#1f266b");
    blueColors.push("#2c378f");
    blueColors.push("#28A7EA");
    blueColors.push("#45BDEE");
    blueColors.push("#7AD6F4");

    const colors = [];
    const assets = this.props.assets.filter(
      asset => asset.newPortfolioPercent > 0
    );
    const pieChartData = [["Coins", "Amount"]];

    let totalNewPortfolioPercentage = 0;
    assets.forEach(asset => {
      totalNewPortfolioPercentage += asset.newPortfolioPercent;
    });

    if (totalNewPortfolioPercentage < 100) {
      pieChartData.push(["Nothing", 100 - totalNewPortfolioPercentage]);
      colors.push("transparent");
    }

    assets.forEach((asset, index) => {
      pieChartData.push([asset.baseAssetName, asset.newPortfolioPercent]);
      if (blueColors.length > index) {
        colors.push(blueColors[index]);
      } else {
        colors.push("#7AD6F4");
      }
    });

    var mySlices = {};
    colors.forEach((color, index) => {
      mySlices[index] = { color: color };
    });

    return (
      <Chart
        // width={'400px'}
        height={"200px"}
        chartType="PieChart"
        loader={<div>Loading Chart..</div>}
        data={pieChartData}
        options={{
          // backgroundColor:'#333',
          //title: 'USD Value: $233',
          backgroundColor: { fill: "transparent" },
          legend: "none",
          is3D: "true",
          // pieHole: 0.7,
          pieSliceText: "none",
          slices: mySlices
        }}
        rootProps={{ "data-testid": "1" }}
      />
    );
  }
}

export default PieChart;
