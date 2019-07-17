import React from 'react';
import Chart from "react-google-charts";

class ShowPieChart extends React.Component {

  colorMap = new Map();
  
  render() {
    var blueColors = []
    blueColors.push("#16194e");
    blueColors.push("#1f266b");
    blueColors.push("#2c378f");
    blueColors.push("#28A7EA");
    blueColors.push("#45BDEE");
    blueColors.push("#7AD6F4");
    
    var colors = []
    var assets = this.props.assets
    var pieChartData = 
      [
        ['Coins', 'Amount']
      ];

    var totalPortfolioPercentage = 0;
    for (var iter = 0; iter < assets.length; iter ++) {
      totalPortfolioPercentage += assets[iter].newPortfolioPercent;
    }

    if(totalPortfolioPercentage < 100) {
      pieChartData.push(['Nothing', (100 - totalPortfolioPercentage)]);
      colors.push('transparent')
    }

    for (var i = 0; i < assets.length; i ++) {
      pieChartData.push([assets[i].symbol, assets[i].newPortfolioPercent]);
      if(blueColors.length > i) {
        colors.push(blueColors[i])
      } else {
        colors.push('#7AD6F4')
      }
    }

    var mySlices = {}
    // eslint-disable-next-line no-redeclare
    for (var i = 0; i < colors.length; i ++) {
      mySlices[i] = { color: colors[i] };
    }
  
    return (                          
        <Chart
          // width={'400px'}
          height={'200px'}
          chartType="PieChart"
          loader={<div>Loading Chart..</div>}
          data={pieChartData}
          
          options={{
              // backgroundColor:'#333',
              //title: 'USD Value: $233',
              backgroundColor: { fill:'transparent' },
              legend: 'none',
              is3D: 'true',
              // pieHole: 0.7,
              pieSliceText: 'none',
              slices: mySlices
          }}
          rootProps={{ 'data-testid': '1' }}
          />
          
    )
  }
}

export default ShowPieChart;