import React from "react";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBAnimation, MDBAlert, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, Animation } from "mdbreact";
import ShowPieChart from "./PieChart";
import AssetSlider from "./AssetSlider";
import {getCurrentAssets, computeTrades} from "./Helpers"
import {getMarketInformation, startTrade} from "./KyberInterface"

import Web3 from 'web3';
import SelectPage from "./SelectPage";
import MyModal from "./MyModal";

var globalMessage = "";

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


async function init(that) {
    try {
        var ethAccounts = await web3.eth.requestAccounts(); 

        if(ethAccounts.length === 0) {
            console.log('THROWWWW')
            throw {err:"noAccount"}()
        }
    } catch (err) {
        // var curMessage = that.state.message;
        // curMessage = curMessage + "requestAccounts failed"
        // that.setState({message: curMessage})
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
        pendingTxs: [],
        currentTrades: [],
        tradeConfirmations : new Map(),
        message : ""
      }
    }

    componentDidMount() {

        console.log('WEB3')
        console.log(web3)

        if(DEBUG) {
            this.addTestAssets();
        }else if (web3 === undefined || web3.givenProvider === null) {
            
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
        //   var token = 'ETH_' + e.target.value;
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
        this.toggle();
        var trades = computeTrades(this.state.assets);
        this.setState({currentTrades:trades})
        console.log('Performing trades: ');
        console.log(trades)
        startTrade(web3, trades, GAS_PRICE, this.tradeCompleteCallback, this.txToCompleteCallback);
      }


    tradeCompleteCallback = hash => {
        console.log('TRADE COMPLETE IN CALLBACK');
        console.log(hash);
    }

    txToCompleteCallback = (type, data, trade) => {

        console.log("txToCompleteCallback");
        console.log(type);
        console.log(data);
        console.log(trade);

        if(type === "transactionHash") {
            var tc = this.state.tradeConfirmations;
            tc.set(trade,"tx")
            this.setState({tradeConfirmations:tc});
        } else if (type === "confirmation") {
            var tc = this.state.tradeConfirmations;
            tc.set(trade,"comf")
        }
        
        this.setState({pendingTxs:data})
    }
    
    render() {

        const imageStyle = {width : '30px'}
        var consoleMessage = globalMessage.split("---")
        var consoleItems = [];
        for(var i =0;i < consoleMessage.length; i++) {
            consoleItems.push(<p key = {i}>{consoleMessage[i]}</p>)
        }
        if(this.state.ready === false) {
            return (
                
                <MDBContainer className = "h-100">

                {/* <MDBAlert color="success">
                    {consoleItems}
                </MDBAlert> */}

                <MDBRow className = "h-100 align-items-center">
                <div style = {{marginLeft: "50%"}} className="spinner-grow text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                </MDBRow>
                </MDBContainer>
            );
        }


        // var whatToShow = <p>Waiting for confirmation from your wallet...</p>;

        // if(this.state.tradeConfirmations.get())

        var currentTxs = []
        this.state.currentTrades.forEach(trade => {
            currentTxs.push(
                // <p>{trade.from} -> {trade.to}</p>
                <MDBAnimation type="zoomInLeft">
                <MDBRow style={{    "text-align": "center"}}>
                    <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + trade.from.toLowerCase() + ".png"}/> </MDBCol>
                    <MDBCol size={"1"}>
                        -->
                    </MDBCol>
                    <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + trade.to.toLowerCase() + ".png"}/> </MDBCol>
                    {/* <MDBCol sm={"6"}> <a href="https://ropsten.etherscan.io/tx/0x6dbcb6eaca690eef54d08733fede54f21baf125400ed8ee08af71a8c5605c0ed"> > </a> </MDBCol> */}
                    <MDBCol size={"5"}>

                    {this.state.tradeConfirmations.get(trade.from + "->" +trade.to) === undefined ?
                    <Animation type="pulse" infinite>
                        <p>Waiting for confirmation from your wallet...</p>
                    </Animation>
                    :
                    ""
                    } 

                    {this.state.tradeConfirmations.get(trade.from + "->" +trade.to) === "tx" ?
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    :
                    ""
                    } 

                    {this.state.tradeConfirmations.get(trade.from + "->" +trade.to) === "comf" ?
                    
                    <Animation type="pulse" infinite>
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                    </Animation>
                    :
                    ""
                    } 



                </MDBCol>
                </MDBRow>
                </MDBAnimation>
            );
        })

        return (

            // <div className="bg">
            

            <MDBContainer className = "h-100">

                <MDBModal size = "lg" isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Confirm</MDBModalHeader>
                    <MDBModalBody>
                        <MDBContainer fluid>
                            {currentTxs}
                            {/* <MDBRow>
                                <MDBCol md="12" className="bg-info">
                                    <h1> CURRENT TXs: </h1>
                                    {currentTxs}
                                </MDBCol>
                            </MDBRow> */}
                        </MDBContainer>
                    </MDBModalBody>
                    <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                    <MDBBtn color="primary">Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>

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
                                    <MDBBtn data-toggle="modal" data-target="#exampleModalCenter" onClick = {this.startKyberTrade} color="primary">Rebalance</MDBBtn>
                                </MDBCol>
                            </MDBRow>

                            {/* <MyModal/> */}

                        </MDBAnimation>
                    </MDBCol>
                </MDBRow>
            </MDBContainer> 
        );
    }
}

export default EasyPortfolioContainer;