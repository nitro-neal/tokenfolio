import React from "react";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBAnimation, MDBInput } from "mdbreact";
import ShowPieChart from "./PieChart";
import AssetSlider from "./AssetSlider";
import MyInput from "./MyInput";
import {getCurrentAssets, computeTrades} from "./Helpers"
import {getMarketInformation, startTrade} from "./KyberInterface"

import Web3 from 'web3';
import SelectPage from "./SelectPage";

const web3 = new Web3(Web3.givenProvider);


var globalTokenPriceInfo = {};

// var GAS_PRICE = 'medium'
var GAS_PRICE = 'low'
var DEBUG = false;

async function fetchPriceInfo() {
    globalTokenPriceInfo = await getMarketInformation('PRICE_INFO');

    console.log('Price info: ');
    console.log(globalTokenPriceInfo)

    return globalTokenPriceInfo;
  }

class EasyPortfolioContainer extends React.Component {
    constructor(props) {
      super(props)
  
      this.state = {
        assets: [],
        availTokens: []
      }
    }

    componentDidMount() {

        if(DEBUG) {
            this.addTestAssets();
        } else {
            web3.eth.requestAccounts()
            .then(fetchPriceInfo()
            .then(priceInfo => this.addAvailTokens(priceInfo))
            .then(priceInfo => getCurrentAssets(web3, priceInfo, this)))
        }
    }

    addAvailTokens(priceInfo) {
        
        var finalAvail = [];
        // console.log('AVAIL TOKEN')
        // console.log(priceInfo)
        for(var key in priceInfo) {
            // console.log(priceInfo[key])
            finalAvail.push(priceInfo[key].token_symbol)
        }

        this.setState({availTokens:finalAvail})

        return priceInfo;
    }

    addTestAssets() {
        var assets = [];
        var ethAsset =  {"symbol" : "ETH", "tokenName" : "Ethereum", "tokenAddress" :  "abc", "amount" : .5, "pricePerAsset":200, "usdValue": 200 * .5, "newPercentUsdValue": 200 * .5, "currentPortfolioPercent" : 50, "newPortfolioPercent" : 50}
        var daiAsset =  {"symbol" : "DAI", "tokenName" : "Dai", "tokenAddress" :  "abc", "amount" : 100, "pricePerAsset":1, "usdValue": 100 * 1, "newPercentUsdValue": 100 * 1, "currentPortfolioPercent" : 50, "newPortfolioPercent" : 50}

        assets.push(ethAsset)
        assets.push(daiAsset)
        this.setState({ assets: assets });
    }

    changeSlider = (asset, value) => {
        // needed so it doesn't 'jump'
        asset.newPortfolioPercent = value;

        var totalPercentage = 0;
        var totalUsdValue = 0;
        for(var i = 0; i < this.state.assets.length; i ++) {
          totalPercentage += this.state.assets[i].newPortfolioPercent;
          totalUsdValue += this.state.assets[i].usdValue
        }

        if(totalPercentage > 100) {
          asset.newPortfolioPercent = value - (totalPercentage - 100) ;
        } else {
          asset.newPortfolioPercent = value;
        }

        asset.newPercentUsdValue = totalUsdValue * (asset.newPortfolioPercent * .01)
        // this is needed, but not sure why..
        this.setState({ assets: this.state.assets });
    }

    // changeGasSlider = (value) => {
    //   console.log('GAS SLIDER CHANGE' + value)
    //   if(value === 0) {
    //     GAS_PRICE = 'low'
    //   } else if (value === 1) {
    //     GAS_PRICE = 'medium'
    //   } else if (value === 2) {
    //     GAS_PRICE = 'high'
    //   }
    // }

    handleKeyDown = e => {
        console.log('HANDLE KEY DOWN PARTENT')
        if (e.keyCode === 13) {
          var token = 'ETH_' + e.target.value;
        //   var asset =  {"symbol" : e.target.value, "tokenAddress" :  globalPriceInfo[token].token_address, "amount" : 0, "pricePerAsset":globalPriceInfo[token].rate_usd_now, "usdValue": 0, "newPercentUsdValue": 0, "currentPortfolioPercent" : 0, "newPortfolioPercent" : 0}
          var asset =  {"symbol" : e.target.value, "tokenAddress" :  'abc', "amount" : 100, "pricePerAsset":.5, "usdValue": 50, "newPercentUsdValue": 0, "currentPortfolioPercent" : 0, "newPortfolioPercent" : 0}
          this.addAsset(asset)
        }
      };

      addAsset(asset) {
        this.addAndComputeNewPercentages(asset)
    }

    handleSelect = e => {
        console.log('ON SELECT')
        console.log(e)
        console.log(e.target.value)

        //if()
        var token = "ETH_" + e.target.value;
        var asset =  {"symbol" : e.target.value, "tokenAddress" :  globalTokenPriceInfo[token].token_address, "amount" : 0, "pricePerAsset":globalTokenPriceInfo[token].rate_usd_now, "usdValue": 0, "newPercentUsdValue": 0, "currentPortfolioPercent" : 0, "newPortfolioPercent" : 0}
        this.addAsset(asset)
    }

    addAndComputeNewPercentages(asset) {
        var currentAssets = this.state.assets;
        currentAssets.push(asset);

        var totalUsdValue = 0;
        for(var i = 0; i < currentAssets.length; i ++) {
          totalUsdValue += currentAssets[i].usdValue;
        }

        for(var j = 0; j < currentAssets.length; j++) {
            currentAssets[j].currentPortfolioPercent = ((currentAssets[j].usdValue / totalUsdValue) * 100.0);
            currentAssets[j].newPortfolioPercent = ((currentAssets[j].usdValue / totalUsdValue) * 100.0);
        }

        this.setState({ assets: currentAssets });
        this.setState({totalUsdValue : totalUsdValue})
    }

    startKyberTrade = () => {
        var trades = computeTrades(this.state.assets);
        console.log('Performing trades: ');
        console.log(trades)
        startTrade(web3, trades, GAS_PRICE, this.tradeCompleteCallback);
      }


      tradeCompleteCallback = hash => {
        console.log('TRADE COMPLETE IN CALLBACK');
        console.log(hash);
        // this.setState({tradeComplete : 1})
      }
    
    render() {
        return (

            // <div className="bg">
            
            <MDBContainer className = "h-100">
                <MDBRow className = "h-100 align-items-center">
                    <MDBAnimation type="slideInLeft">
                        <MDBCol className = "col-example" md="5">
                            <div className = "logo">
                                <a href = {"/"} >Cryptofolio</a>
                            </div>
                        </MDBCol>
                    </MDBAnimation>

                    <MDBCol className = "col-example" md="7">
                        <MDBAnimation type="slideInRight">

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol>
                                    <ShowPieChart assets = {this.state.assets}/>
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol>
                                    {/* <MyInput onKeyDown={this.handleKeyDown}/> */}
                                    <SelectPage handleSelect = {this.handleSelect} availTokens = {this.state.availTokens}/>
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol>
                                    <AssetSlider changeSlider = {this.changeSlider} assets = {this.state.assets} />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol style = {{"textAlign": "center", "paddingTop" : "40px"}}>
                                    <MDBBtn onClick = {this.startKyberTrade} color="primary">Rebalance</MDBBtn>
                                </MDBCol>
                            </MDBRow>

                        </MDBAnimation>
                    </MDBCol>
                </MDBRow>
            </MDBContainer> 
        );
    }
}

export default EasyPortfolioContainer;