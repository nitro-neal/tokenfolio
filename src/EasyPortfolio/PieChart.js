import React from 'react';
import Chart from "react-google-charts";
//import {Container, Row, Col} from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

class ShowPieChart extends React.Component {

  colorMap = new Map();
  
  // componentDidMount() {
  //   this.colorMap.set('BTC', 'orange');
  //   this.colorMap.set('WBTC', 'orange');
  //   this.colorMap.set('ETH', 'grey');
  //   this.colorMap.set('BAT', 'red');
  //   this.colorMap.set('DAI', 'yellow');
  //   this.colorMap.set('OMG','blue');
  // }

  render() {

    this.colorMap.set('BTC', 'orange');
    this.colorMap.set('WBTC', 'orange');
    this.colorMap.set('ETH', 'grey');
    this.colorMap.set('BAT', 'red');
    this.colorMap.set('DAI', 'yellow');
    this.colorMap.set('OMG','blue');
    
    // console.log('ASSETS: ')
    // console.log(this.props.assets);
    
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
      if(this.colorMap.has(assets[i].symbol)) {
        colors.push(this.colorMap.get(assets[i].symbol))
      } else {
        colors.push('green')
      }
    }

    return (
      

                                
        <Chart
          // width={'200px'}
          // height={'200px'}
          chartType="PieChart"
          loader={<div>Loading Chart..</div>}
          data={pieChartData}
          
          options={{
              // backgroundColor:'#333',
              backgroundColor: { fill:'transparent' },
              legend: 'none',
              pieHole: 0.7,
              pieSliceText: 'none',
              slices: {
                0: { color: colors[0] },
                1: { color: colors[1] },
                2: { color: colors[2] },
                3: { color: colors[3] },
                4: { color: colors[4] },
                5: { color: colors[5] },
                6: { color: colors[6] },
                7: { color: colors[7] },
                8: { color: colors[8] },
                9: { color: colors[9] },
                10: { color: colors[10] }
              }
          }}
          rootProps={{ 'data-testid': '1' }}
          />
    )
  }
}

export default ShowPieChart;