
import React from "react";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBAnimation, MDBAlert, Animation, MDBIcon } from "mdbreact";
import ShowPieChart from "./PieChart";
import AssetSlider from "./AssetSlider";
import {getCurrentAssets, computeTrades} from "./Helpers"
import {getMarketInformation, startTrade} from "./AlternateKyberInterface"
import Web3 from 'web3';
import SelectPage from "./SelectPage";
import LoadingPage from "./LoadingPage";
import MyModal from "./MyModal";
import ToggleSwitch from "./ToggleSwitch";
import NoWebThree from "./NoWebThree";


var NETWORK_URL = "";
// const NETWORK_URL = "https://ropsten-api.kyber.network"
// const NETWORK_URL = "https://api.kyber.network";

const web3 = new Web3(Web3.givenProvider);
var globalTokenPriceInfo = {};
var GAS_PRICE = 'low'
var DEBUG = false;

async function fetchPriceInfo() {
    globalTokenPriceInfo = await getMarketInformation('PRICE_INFO', NETWORK_URL);

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
        message : "",
        trading : false,
        totalPercentage : 100.0,
        totalUsdValue: -1.0,
        isChecked: true
      }
    }

    componentDidMount() {

        // window.sessionStorage.setItem("mykey", "mainnet");

        const network = window.sessionStorage.getItem("network");
        console.log('Current Network')
        console.log(network)
        if (network && network === "testnet") {
            this.setState({isChecked:false})
            NETWORK_URL = "https://ropsten-api.kyber.network"
        } else if (network && network === "mainnet") {
            this.setState({isChecked:true})
            NETWORK_URL = "https://api.kyber.network";
        } else {
            this.setState({isChecked:true})
            NETWORK_URL = "https://api.kyber.network";
        }

        if(DEBUG) {
            this.addTestAssets();
        } else if (web3 === undefined || web3.givenProvider === null) {
            this.setState({ready:true})
            this.setState({message:"noweb3"})
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

    refreshPage() {
        window.location.reload();
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

        if(totalPercentage >= 100) {
            totalPercentage = 100
        }

        this.setState({totalUsdValue: totalUsdValue})
        this.setState({totalPercentage:totalPercentage})
    }

    addAsset(asset) {
        this.addAndComputeNewPercentages(asset)
    }

    handleSelect = e => {
        for(var i = 0; i < this.state.assets.length; i ++) {
            if(this.state.assets[i].symbol === e.target.value) {
                return;
            }
        }

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

        if(trades.length ===0) {
            return;
        }

        this.toggle();
        this.setState({trading:true})

        this.setState({currentTrades:trades})

        console.log('Performing trades: ');
        console.log(trades)
        startTrade(web3, trades, GAS_PRICE, this.txToCompleteCallback, this.approvalsCallback, NETWORK_URL);
      }

    txToCompleteCallback = (type, data, trade) => {

        console.log("txToCompleteCallback");
        console.log(type);
        console.log(data);
        console.log(trade);
        var tc = this.state.tradeConfirmations;

        if(type === "transactionHash") {
            tc.set(trade,"tx-" + data)
        } else if (type === "confirmation") {
            var hash = tc.get(trade).split('-')[1]
            tc.set(trade,"comf-"+hash)
        }
        
        this.setState({tradeConfirmations:tc})
    }

    approvalsCallback = (token) => {
        var explode = token.split('-')
        var approvals = this.state.currentApprovals;
        approvals.push(explode[0])
        this.setState({currentApprovals: approvals})
    }

    toggleSwitch = () => {
        console.log('toggle switch called')
        if(this.state.isChecked === true) {
            window.sessionStorage.setItem("network", "testnet");
        }

        if(this.state.isChecked === false) {
            window.sessionStorage.setItem("network", "mainnet");
        }

        this.refreshPage();
    }

    render() {
        
        var textAlignCenter = {"textAlign" :"center" }
        var buttonToRender;

        if(this.state.ready === false) {
            return <LoadingPage/>
        }

        if(this.state.message === "noweb3") {
            return <NoWebThree/>
        }

        if(this.state.trading) {
            buttonToRender = <MDBBtn data-toggle="modal" data-target="#exampleModalCenter" onClick = {this.toggle} color="primary"><Animation type="pulse" infinite>Balancing in progress...</Animation></MDBBtn>

        } else {
            if(this.state.totalPercentage >= 99.99) {
                buttonToRender = <MDBBtn data-toggle="modal" data-target="#exampleModalCenter" onClick = {this.startKyberTrade} color="primary">Rebalance</MDBBtn>

            } else {
                buttonToRender = <MDBBtn data-toggle="modal" disabled data-target="#exampleModalCenter" onClick = {this.startKyberTrade} color="primary">Rebalance</MDBBtn>
            }
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

                {this.state.totalUsdValue === 0 ?
                <MDBAlert color="success">
                <MDBRow className = "h-100 align-items-center">
                <MDBCol style={textAlignCenter}>
                    <h1>Don't be a filty nocoiner!</h1>
                    <a rel="noopener noreferrer" target= "_blank" href = "https://www.coinbase.com"> <h2>Buy Ethereum <MDBIcon icon="space-shuttle" /> </h2>  </a>
                    </MDBCol>
                    </MDBRow>
                </MDBAlert>
                :
                ""
                } 

                <MDBRow className = "h-100 align-items-center">
                    <MDBAnimation type="slideInLeft">
                        <MDBCol className = "col-example" md="5">
                            <div className = "logo">
                                {/* cryptofolio */}
                                <a href = {"/"} >Tokenfolio </a>
                            </div>
                        </MDBCol>
                    </MDBAnimation>

                    <MDBCol className = "col-example" md="7">
                        <MDBAnimation type="slideInRight">

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol>
                                    
                                    <ShowPieChart assets = {this.state.assets}/>
                                    <p style = {textAlignCenter} >USD Value: ${Math.round(this.state.totalUsdValue * 100) / 100}</p>
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol>
                                    <SelectPage handleSelect = {this.handleSelect} availTokens = {this.state.availTokens}/>
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol>
                                    <AssetSlider totalUsdValue = {this.state.totalUsdValue} totalPercentage={this.state.totalPercentage} changeSlider = {this.changeSlider} assets = {this.state.assets} />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol style = {{"textAlign": "center", "paddingTop" : "40px"}}>
                                    {buttonToRender}
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol style = {{"textAlign": "center", "paddingTop" : "40px"}}>
                                    <ToggleSwitch toggleSwitch={this.toggleSwitch} checked = {this.state.isChecked}/>
                                    {this.state.isChecked ? <p>Mainnet</p> : <p>Ropsten</p> }
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