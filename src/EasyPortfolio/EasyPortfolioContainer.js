import React from "react";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBAnimation, MDBAlert } from "mdbreact";
import ShowPieChart from "./PieChart";
import AssetSlider from "./AssetSlider";
import {getCurrentAssets, computeTrades} from "./Helpers"
import {getMarketInformation, startTrade} from "./AlternateKyberInterface"
import Web3 from 'web3';
import SelectPage from "./SelectPage";
import LoadingPage from "./LoadingPage";
import MyModal from "./MyModal";

const web3 = new Web3(Web3.givenProvider);
var globalTokenPriceInfo = {};
var GAS_PRICE = 'low'
var DEBUG = false;

async function fetchPriceInfo() {
    globalTokenPriceInfo = await getMarketInformation('PRICE_INFO');

    console.log('Price info: ');
    console.log(globalTokenPriceInfo)

    return globalTokenPriceInfo;
}


async function init(that) {
    try {
        var ethAccounts = await web3.eth.requestAccounts(); 

        if(ethAccounts.length === 0) {
            console.log('Throw error for old web3 impl, should still work and continue..')
            throw {err:"noAccount"}()
        }
    } catch (err) {
        console.log("requestAccounts failed, Works fine still for older web3 implementations")
    }

    var priceInfo = await fetchPriceInfo()

    that.addAvailTokens(priceInfo)
    getCurrentAssets(web3, priceInfo, that)
    that.setState({ready:true})
}

class EasyPortfolioContainer extends React.Component {
    constructor(props) {
      super(props)
  
      this.state = {
        assets: [],
        modal: false,
        availTokens: [],
        ready: false,
        currentTrades: [],
        currentApprovals: [],
        tradeConfirmations : new Map(),
        message : ""
      }
    }

    componentDidMount() {
        if(DEBUG) {
            this.addTestAssets();
        } else if (web3 === undefined || web3.givenProvider === null) {
            this.setState({ready:true})
            this.setState({message:"web3 not connected"})
        } else {
            init(this)   
        }
    }

    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    addAvailTokens(priceInfo) {
        var finalAvail = [];
        for(var key in priceInfo) {
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

    addAsset(asset) {
        this.addAndComputeNewPercentages(asset)
    }

    handleSelect = e => {
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
        this.toggle();
        var trades = computeTrades(this.state.assets);
        this.setState({currentTrades:trades})

        console.log('Performing trades: ');
        console.log(trades)
        startTrade(web3, trades, GAS_PRICE, this.txToCompleteCallback, this.approvalsCallback);
      }


    // tradeCompleteCallback = hash => {
    //     console.log('TRADE COMPLETE IN CALLBACK');
    //     console.log(hash);
    // }

    txToCompleteCallback = (type, data, trade) => {

        console.log("txToCompleteCallback");
        console.log(type);
        console.log(data);
        console.log(trade);
        var tc = this.state.tradeConfirmations;

        if(type === "transactionHash") {
            tc.set(trade,"tx")
        } else if (type === "confirmation") {
            tc.set(trade,"comf")
        }
        
        this.setState({tradeConfirmations:tc})
    }

    approvalsCallback = (token) => {
        var explode = token.split('-')
        var approvals = this.state.currentApprovals;
        approvals.push(explode[0])
        this.setState({currentApprovals: approvals})
    }
    
    render() {
        
        if(this.state.ready === false) {
            return <LoadingPage/>
        }

        return (
            <MDBContainer className = "h-100">
            
                <MyModal currentApprovals={this.state.currentApprovals} modal={this.state.modal} toggle={this.toggle} tradeConfirmations={this.state.tradeConfirmations} currentTrades={this.state.currentTrades}/>

                {this.state.message === "" ?  
                ""
                :
                <MDBAlert color="success">
                    {/* {consoleItems} */}
                    {this.state.message}
                </MDBAlert>
                }

                <MDBRow className = "h-100 align-items-center">
                    <MDBAnimation type="slideInLeft">
                        <MDBCol className = "col-example" md="5">
                            <div className = "logo">
                                <a href = {"/"} >Cryptofolio </a>
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
                                    <MDBBtn data-toggle="modal" data-target="#exampleModalCenter" onClick = {this.startKyberTrade} color="primary">Rebalance</MDBBtn>
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