/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBAnimation,
    MDBAlert,
    Animation,
    MDBIcon,
    MDBModal,
    MDBModalBody,
    MDBModalHeader
} from "mdbreact";
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
import isMobile from "react-device-detect";
import axios from "axios";


var NETWORK_URL = "";
// const NETWORK_URL = "https://ropsten-api.kyber.network" const NETWORK_URL =
// "https://api.kyber.network"; convert to full web3 -
// https://medium.com/easwap/dex-in-15-days-144b71166e73 Shortcuts clg->
// console.log(object) cmd+b to remove left side panel cmd+p to find file select
// then cmd + shift + b for beatify cmd+k then z for zen mode 
//shift+  cmd + M for problems menu 

const web3 = new Web3(Web3.givenProvider);
var globalTokenPriceInfo = {};
var GAS_PRICE = 'low'
var DEBUG = false;


async function fetchPriceInfo() {

    globalTokenPriceInfo = await getMarketInformation('PRICE_INFO', NETWORK_URL);
    // console.log('Price info: '); console.log(globalTokenPriceInfo)

    if(globalTokenPriceInfo.ETH_BAT.rate_usd_now === 0) {
        console.log('price info down, getting backup')
    
        let coinSymbols = ''
        for (var key in globalTokenPriceInfo) {
            console.log(key.split('_')[1])
            coinSymbols += key.split('_')[1] + ","
        }

        coinSymbols.substring(0,coinSymbols.length-1)

        let ccKey = process.env.REACT_APP_CC_KEY
        let cCompareResult = await axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + coinSymbols + '&tsyms=USD&api_key=' + ccKey )

        for (var key in cCompareResult.data) {
            let kyberKey = 'ETH_' + key;
            if(globalTokenPriceInfo[kyberKey] !== undefined) {
                globalTokenPriceInfo[kyberKey].rate_usd_now = cCompareResult.data[key].USD;
                
            }
        }
    }
    return globalTokenPriceInfo;
}

async function init(that) {

    try {
        var ethAccounts = await web3
            .eth
            .requestAccounts();

        if (ethAccounts.length === 0) {
            console.log('Throw error for old web3 impl, should still work and continue..')
            throw {
                err : "noAccount"
            }()
        }
    } catch (err) {
        console.log(
            "requestAccounts failed, Works fine still for older web3 implementations"
        )
    }

    var priceInfo = await fetchPriceInfo()

    that.addAvailTokens(priceInfo)
    getCurrentAssets(web3, priceInfo, that)
    that.setState({ready: true})
}

class EasyPortfolioContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            assets: [],
            modal: false,
            settingsModal: false,
            availTokens: [],
            ready: false,
            currentTrades: [],
            currentApprovals: [],
            tradeConfirmations: new Map(),
            message: "",
            trading: false,
            totalPercentage: 100.0,
            totalUsdValue: -1.0,
            isChecked: true,
            showUsdIsChecked: true,
            gtag: {},
            finalLoadingCount : 0,
            currentLoadingCount: 0
        }
    }

    componentDidMount() {

        this.gtag = window.gtag

        const network = window
            .sessionStorage
            .getItem("network");
        const showUsd = window
            .sessionStorage
            .getItem("showUsd");
        console.log('Current Ethereum Network: ' + network)
        console.log('Current Show Checked Option: ' + showUsd)

        if (network && network === "testnet") {
            this.setState({isChecked: false})
            NETWORK_URL = "https://ropsten-api.kyber.network"
        } else if (network && network === "mainnet") {
            this.setState({isChecked: true})
            NETWORK_URL = "https://api.kyber.network";
        } else {
            this.setState({isChecked: true})
            NETWORK_URL = "https://api.kyber.network";
        }

        if(showUsd === true || showUsd === false) {
            this.setState({showUsdIsChecked: showUsd})
        }

        if (DEBUG) {
            this.addTestAssets();
        } else if (web3 === undefined || web3.givenProvider === null) {
            this.setState({ready: true})
            this.setState({message: "noweb3"})
        } else {
            init(this)
        }

        // printMemoryUsage();
    }

    loadingStart = (number) => {
        this.setState({finalLoadingCount: number})
    }

    loadingDone = () => {
        var curCount = this.state.currentLoadingCount;
        this.setState({currentLoadingCount: (curCount+1)})
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    settingsToggle = () => {
        this.setState({
            settingsModal: !this.state.settingsModal
        });
    }

    addAvailTokens(priceInfo) {
        var finalAvail = [];
        for (var key in priceInfo) {
            finalAvail.push(priceInfo[key].token_symbol)
        }
        this.setState({availTokens: finalAvail})
        return priceInfo;
    }

    refreshPage() {
        window
            .location
            .reload();
    }

    addTestAssets() {
        var assets = [];
        var ethAsset = {
            "symbol": "ETH",
            "tokenName": "Ethereum",
            "tokenAddress": "abc",
            "amount": .5,
            "pricePerAsset": 200,
            "usdValue": 200 * .5,
            "newPercentUsdValue": 200 * .5,
            "currentPortfolioPercent": 50,
            "newPortfolioPercent": 50
        }
        var daiAsset = {
            "symbol": "DAI",
            "tokenName": "Dai",
            "tokenAddress": "abc",
            "amount": 100,
            "pricePerAsset": 1,
            "usdValue": 100 * 1,
            "newPercentUsdValue": 100 * 1,
            "currentPortfolioPercent": 50,
            "newPortfolioPercent": 50
        }

        assets.push(ethAsset)
        assets.push(daiAsset)
        this.setState({assets: assets});
        // printMemoryUsage();
    }

    changeSlider = (asset, value) => {
        // needed so it doesn't 'jump'
        asset.newPortfolioPercent = value;

        var totalPercentage = 0;
        var totalUsdValue = 0;
        for (var i = 0; i < this.state.assets.length; i++) {
            totalPercentage += this
                .state
                .assets[i]
                .newPortfolioPercent;
            totalUsdValue += this
                .state
                .assets[i]
                .usdValue
        }

        if (totalPercentage > 100) {
            asset.newPortfolioPercent = value - (totalPercentage - 100);
        } else {
            asset.newPortfolioPercent = value;
        }

        asset.newPercentUsdValue = totalUsdValue * (asset.newPortfolioPercent * .01)
        // this is needed, but not sure why..
        this.setState({assets: this.state.assets});

        if (totalPercentage >= 100) {
            totalPercentage = 100
        }

        this.setState({totalUsdValue: totalUsdValue})
        this.setState({totalPercentage: totalPercentage})
    }

    addAsset(asset) {
        console.log(asset)
        this.addAndComputeNewPercentages(asset)
    }

    handleSelect = e => {
        for (var i = 0; i < this.state.assets.length; i++) {
            if (this.state.assets[i].symbol === e.target.value) {
                return;
            }
        }

        var token = "ETH_" + e.target.value;
        var asset = {
            "symbol": e.target.value,
            "tokenAddress": globalTokenPriceInfo[token].token_address,
            "amount": 0,
            "pricePerAsset": globalTokenPriceInfo[token].rate_usd_now,
            "usdValue": 0,
            "newPercentUsdValue": 0,
            "currentPortfolioPercent": 0,
            "newPortfolioPercent": 0
        }
        this.addAsset(asset)
    }

    addAndComputeNewPercentages(asset) {
        var currentAssets = this.state.assets;
        currentAssets.push(asset);

        var totalUsdValue = 0;
        for (var i = 0; i < currentAssets.length; i++) {
            totalUsdValue += currentAssets[i].usdValue;
        }

        for (var j = 0; j < currentAssets.length; j++) {
            currentAssets[j].currentPortfolioPercent = (
                (currentAssets[j].usdValue / totalUsdValue) * 100.0
            );
            currentAssets[j].newPortfolioPercent = (
                (currentAssets[j].usdValue / totalUsdValue) * 100.0
            );
        }

        this.setState({assets: currentAssets});
        this.setState({totalUsdValue: totalUsdValue})
    }

    startKyberTrade = () => {

        var trades = computeTrades(this.state.assets);

        if (trades.length === 0) {
            return;
        }

        this.toggle();
        this.setState({trading: true})

        this.setState({currentTrades: trades})

        // console.log('Performing trades: ');
        // console.log(trades)

        try {
            this.gtag('event', 'clickBalanceReal', {
                'event_category': 'clickBalanceRealCategory',
                'event_label': 'clickBalanceRealLabel',
                'transport_type': 'beacon',
                'event_callback': function () {}
            });
        } catch (e) {}

        startTrade(
            web3,
            trades,
            GAS_PRICE,
            this.txToCompleteCallback,
            this.approvalsCallback,
            NETWORK_URL
        );
    }

    txToCompleteCallback = (type, data, trade) => {

        var tc = this.state.tradeConfirmations;

        if (type === "transactionHash") {
            tc.set(trade, "tx-" + data)
        } else if (type === "confirmation") {
            var hash = tc
                .get(trade)
                .split('-')[1]
            tc.set(trade, "comf-" + hash)
        }

        this.setState({tradeConfirmations: tc})
    }

    approvalsCallback = (token) => {
        var explode = token.split('-')
        var approvals = this.state.currentApprovals;
        approvals.push(explode[0])
        this.setState({currentApprovals: approvals})
    }


    showUsdToggleSwitch = () => {
        window.sessionStorage.setItem("showUsd", !this.state.showUsdIsChecked);
        this.setState({showUsdIsChecked:!this.state.showUsdIsChecked})
    }

    toggleSwitch = () => {
        if (this.state.isChecked === true) {
            window
                .sessionStorage
                .setItem("network", "testnet");
        }

        if (this.state.isChecked === false) {
            window
                .sessionStorage
                .setItem("network", "mainnet");
        }

        this.refreshPage();
    }

    render() {

        var textAlignCenter = {
            "textAlign": "center"
        }
        var buttonToRender;
        var showUsdRender;
        var animationTypeLeft = "slideInLeft";
        var animationTypeRight = "slideInRight";

        if (isMobile) {
            animationTypeLeft = "flipInX";
            animationTypeRight = "flipInX";
        }

        if (this.state.ready === false) {
            return <LoadingPage/>
        }

        if (this.state.message === "noweb3") {
            return <NoWebThree/>
        }

        if(this.state.showUsdIsChecked) {
            if(this.state.totalUsdValue === -1.0) {
                showUsdRender = <div key="usdvalue" className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            } else {
                showUsdRender = <p style={textAlignCenter}>USD Value: ${Math.round(this.state.totalUsdValue * 100) / 100}</p>
            }
        }

        if (this.state.trading) {
            buttonToRender = <MDBBtn
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={this.toggle}
                color="indigo">
                <Animation type="pulse" infinite="infinite">Balancing in progress...</Animation>
            </MDBBtn>

        } else {
            if (this.state.totalPercentage >= 99.99) {
                buttonToRender = <MDBBtn
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                    onClick={this.startKyberTrade}
                    color="indigo">Rebalance</MDBBtn>

            } else {
                buttonToRender = <MDBBtn
                    data-toggle="modal"
                    disabled
                    data-target="#exampleModalCenter"
                    onClick={this.startKyberTrade}
                    color="indigo">Rebalance</MDBBtn>
            }
        }

        return (

            <MDBContainer className="h-100 custom-bg-ellipses" >

                <MDBModal
                    isOpen={this.state.settingsModal}
                    toggle={this.settingsToggle}
                    centered>
                    <MDBModalHeader>Settings</MDBModalHeader>
                    <MDBModalBody>
                        <MDBRow className="h-100 align-items-center">
                            <MDBCol
                                style={{
                                    "textAlign" : "center",
                                    "paddingTop" : "40px"
                                }}>
                                <ToggleSwitch toggleSwitch={this.showUsdToggleSwitch} checked={this.state.showUsdIsChecked}/> {
                                    this.state.showUsdIsChecked
                                        ? <p>Show USD Amount</p>
                                        : <p>Don't Show USD Amount</p>
                                }
                            </MDBCol>
                        </MDBRow>

                        <MDBRow className="h-100 align-items-center">
                            <MDBCol
                                style={{
                                    "textAlign" : "center",
                                    "paddingTop" : "40px"
                                }}>
                                <ToggleSwitch toggleSwitch={this.toggleSwitch} checked={this.state.isChecked}/> {
                                    this.state.isChecked
                                        ? <p>Mainnet</p>
                                        : <p>Ropsten</p>
                                }
                            </MDBCol>
                        </MDBRow>

                        <MDBRow className="h-100 align-items-center">
                            <MDBCol
                                style={{
                                textAlign: "center",
                                paddingTop: "40px"
                                }}
                            >
                                <a href="https://binance.tokenfolio.cc">
                                {" "}
                                Switch To Binance Chain{" "}
                                </a>
                            </MDBCol>
                        </MDBRow>
                    </MDBModalBody>
                </MDBModal>

                <MyModal
                    currentApprovals={this.state.currentApprovals}
                    modal={this.state.modal}
                    toggle={this.toggle}
                    tradeConfirmations={this.state.tradeConfirmations}
                    currentTrades={this.state.currentTrades}/> {
                    this.state.message === ""
                        ? ""
                        : <MDBAlert color="success">
                                {this.state.message}
                            </MDBAlert>
                }

                {
                    this.state.totalUsdValue === 0
                        ? <MDBAlert color="success">
                                <MDBRow className="h-100 align-items-center">
                                    <MDBCol style={textAlignCenter}>
                                        <h1>Don't be a filthy nocoiner!</h1>
                                        <a rel="noopener noreferrer" target="_blank" href="https://www.coinbase.com">
                                            <h2>Buy Ethereum
                                                <MDBIcon icon="space-shuttle"/>
                                            </h2>
                                        </a>
                                    </MDBCol>
                                </MDBRow>
                            </MDBAlert>
                        : ""
                }

                <MDBRow className="h-100 align-items-center">

                    <MDBCol md="4">
                        <MDBAnimation type={animationTypeLeft}>
                            <div className="logo">
                                <img className="img-fluid" alt="Tokenfolio logo" src="tflogo.png"></img>
                                <ShowPieChart assets={this.state.assets}/> 
                                {showUsdRender}
                            </div>
                        </MDBAnimation>
                    </MDBCol>

                    <MDBCol md="8">
                        <MDBAnimation type={animationTypeRight}>
                            <MDBRow className="h-100 align-items-center">
                                <MDBCol>
                                    <SelectPage
                                        handleSelect={this.handleSelect}
                                        availTokens={this.state.availTokens}/>
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className="h-100 align-items-center">
                                <MDBCol>
                                    <AssetSlider
                                        totalUsdValue={this.state.totalUsdValue}
                                        totalPercentage={this.state.totalPercentage}
                                        changeSlider={this.changeSlider}
                                        assets={this.state.assets}/>

                                        {this.state.currentLoadingCount === (this.state.finalLoadingCount) ?
                                            ""
                                            :
                                            <div className="centerthings">
                                                <div key="usdvalue" className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                                <p>{this.state.currentLoadingCount} / {this.state.finalLoadingCount}</p>
                                            </div>
                                        }

                                </MDBCol>
                            </MDBRow>

                            <MDBRow className="h-100 align-items-center">

                                <MDBCol
                                    style={{
                                        "textAlign" : "center",
                                        "paddingTop" : "40px"
                                    }}>
                                    <div
                                        style={{
                                            "paddingLeft" : "20px"
                                        }}>
                                        {buttonToRender}
                                        <a
                                            style={{
                                                "color" : "#586b81"
                                            }}
                                            href="#"
                                            onClick={this.settingsToggle}><MDBIcon
                                            style={{
                        "verticalAlign" : "bottom",
                        "paddingBottom" : "7px"
                    }}
                                            color="#586b81"
                                            icon="cog"/>
                                        </a>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className="h-100 align-items-center">
                                <MDBCol
                                    style={{
                                        "textAlign" : "center",
                                        "paddingTop" : "40px"
                                    }}>
                                    <p>Powered by
                                        <a rel="noopener noreferrer" href="https://kyber.network/" target="_blank"> Kyber network</a>
                                    </p>
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
