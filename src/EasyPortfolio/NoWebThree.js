/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
    MDBJumbotron,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBCardBody,
    MDBAnimation,
    MDBModal,
    MDBBtn
} from "mdbreact";
import AssetSlider from "./AssetSlider";
import ShowPieChart from "./PieChart";

class NoWebThree extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            toggle: false,
            fakeKyberTradeToggle: false,
            totalPercentage: 100.0,
            totalUsdValue: 100,
            assets: [],
            gtag: {}
        }

    }

    toggleit = () => {
        this.setState({
            toggle: !this.state.toggle
        })
    }

    componentDidMount() {
        this.gtag = window.gtag
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
            "amount": 20,
            "pricePerAsset": 1,
            "usdValue": 20 * 1,
            "newPercentUsdValue": 20 * 1,
            "currentPortfolioPercent": 20,
            "newPortfolioPercent": 20
        }

        var batAsset = {
            "symbol": "BAT",
            "tokenName": "BAT",
            "tokenAddress": "abc",
            "amount": 30,
            "pricePerAsset": 1,
            "usdValue": 30 * 1,
            "newPercentUsdValue": 30 * 1,
            "currentPortfolioPercent": 30,
            "newPortfolioPercent": 30
        }

        assets.push(ethAsset)
        assets.push(batAsset)
        assets.push(daiAsset)

        this.setState({assets: assets});
    }

    fakeKyberTrade = () => {

        this.gtag('event', 'clickDemo', {
            'event_category': 'clickDemoCategory',
            'event_label': 'clickDemoLabel',
            'transport_type': 'beacon',
            'event_callback': function () {}
        });

        this.setState({
            fakeKyberTradeToggle: !this.state.fakeKyberTradeToggle
        })
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

    render() {
        var videoSrc = "https://www.youtube.com/embed/6cfVeG2ga-U?rel=0";
        var textAlignCenter = {
            "textAlign": "center"
        }

        if (this.state.toggle) {
            videoSrc += "&autoplay=1"
        }

        return (

            <MDBAnimation key="noweb3" type="zoomInLeft">
                <MDBContainer className="mt-5 text-center">
                    <MDBRow>
                        <MDBModal isOpen={this.state.toggle} toggle={this.toggleit} size="large"
                            position="top">
                            <div className="video-container">
                                <iframe
                                    title="Tokenfolio"
                                    width="560"
                                    height="315"
                                    src={videoSrc}
                                    frameborder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen="allowfullscreen"></iframe>
                            </div>
                        </MDBModal>

                        <MDBCol>
                            <MDBJumbotron>
                                <MDBCardBody className ="bg-ellipses">

                                    <div >
                                        <img className="img-fluid" alt="Tokenfolio logo" src="tflogo.png"></img>
                                        <hr className="my-4"/>
                                    </div>
                                   

                                   <h1>Create your cryptocurrency portfolio today</h1>


                                   {/*
                                    <h4>Create a portfolio of ethereum tokens directly from your wallet in an
                                        instant, secure and convenient way</h4>
                                   */}

                                    <hr className="my-4"/>

                                    <a href="#" onClick={this.toggleit} backgroundcolor="#2d323e" color="#2d323e">
                                        <h4>View Demo</h4>
                                    </a>
                                    <a href="#" onClick={this.toggleit} backgroundcolor="#2d323e" color="#2d323e">
                                        <img alt = "play button" src="play.png"></img>
                                    </a>

                                    <hr className="my-4"/> {/* <div class="video-container">
            <iframe title="Tokenfolio" width="560" height="315" src="https://www.youtube.com/embed/FO-SnkFPWpA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div> */
                                    }

                                    <p>To use this app you need to have a web3 wallet installed.</p>
                                    <p>
                                        <a rel="noopener noreferrer" target="_blank" href="https://metamask.io/">
                                            Get Metamask
                                            <MDBIcon icon="external-link-alt"/>
                                        </a>
                                    </p>

                                </MDBCardBody>

                            </MDBJumbotron>

                            <MDBJumbotron>

                                <div className="logo">
                                    {/* cryptofolio */}
                                    {/* <a href = {"/"} > <h1>Tokenfolio</h1> </a> */}
                                    <h2>Change the sliders and click rebalance.</h2>
                                    <ShowPieChart assets={this.state.assets}/> {
                                        this.state.usdValue === -1
                                            ? <div key="usdvalue" className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            : <p style={textAlignCenter}>USD Value: ${Math.round(this.state.totalUsdValue * 100) / 100}</p>
                                    }
                                    {/*  <a href = {"/"} ><img alt="tokenfolio" src="./tokenfolio-logo.png" ></img> <
 *  /a>

 */
                                    }

                                </div>

                                <MDBRow className="h-100 align-items-center">
                                    <MDBCol>
                                        <AssetSlider
                                            totalUsdValue={this.state.totalUsdValue}
                                            totalPercentage={this.state.totalPercentage}
                                            changeSlider={this.changeSlider}
                                            assets={this.state.assets}/> {
                                            this.state.fakeKyberTradeToggle === false
                                                ? ""
                                                : <MDBAnimation key="instruction" type="flipInX">
                                                        <hr className="my-4"/>
                                                        <div>
                                                            <h4>As easy as that!</h4>
                                                            <h4>To make it for real though you need to install an ethereum wallet: </h4>
                                                            <hr className="my-4"/>
                                                            <p>For desktop install -
                                                                <a rel="noopener noreferrer" target="_blank" href="https://metamask.io/"> Metamask Extension.</a>
                                                            </p>
                                                            <p>For Android/IOS install -
                                                                <a rel="noopener noreferrer" target="_blank" href="https://trustwallet.com">Trust Wallet</a>
                                                            </p>

                                                            <hr className="my-4"/>
                                                            <h4>After installation return to <a rel="noopener noreferrer" target="_blank" href="https://metamask.io/"> Tokenfolio.cc</a></h4>
                                                        </div>
                                                        <hr className="my-4"/>
                                                    </MDBAnimation>
                                        }

                                        <MDBBtn onClick={this.fakeKyberTrade} color="indigo">Rebalance</MDBBtn>

                                    </MDBCol>
                                </MDBRow>
                            </MDBJumbotron>

                            <div className="row">
                                <div className="col-12 col-lg-4">
                                    <div className="card features">
                                        <div className="card-body">
                                            <div className="media">
                                                {/* <span class="ti-face-smile gradient-fill ti-3x mr-3"></span> */}
                                                {/* <MDBIcon icon="external-link-alt" /> */}
                                                <div className="media-body">
                                                    <h4 className="card-title">Simple!</h4>
                                                    <p className="card-text">But first you need a web3 wallet.</p>
                                                    <p>
                                                        <a rel="noopener noreferrer" target="_blank" href="https://metamask.io/">
                                                            Get Metamask
                                                            <MDBIcon icon="external-link-alt"/>
                                                        </a>
                                                    </p>
                                                    <a
                                                        rel="noopener noreferrer"
                                                        target="_blank"
                                                        href="https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-Started-With-MetaMask-Part-1-">
                                                        Learn More...</a>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-4">
                                    <div className="card features">
                                        <div className="card-body">
                                            <div className="media">
                                                <span className="ti-settings gradient-fill ti-3x mr-3"></span>
                                                <div className="media-body">
                                                    <h4 className="card-title">What the hell is a web3 wallet?</h4>
                                                    <p className="card-text">A web3 wallet allows you to manage your Ethereum and
                                                        Ethereum tokens. This allows you to visit the distributed web of tomorrow in
                                                        your browser.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-4">
                                    <div className="card features">
                                        <div className="card-body">
                                            <div className="media">
                                                <span className="ti-lock gradient-fill ti-3x mr-3"></span>
                                                <div className="media-body">
                                                    <h4 className="card-title">Don't be a nocoiner.</h4>
                                                    <p className="card-text">A nocoiner is a person who owns no cryptocurrencies and
                                                        thinks that an investment in Venezuelan Peso, Turkish Lira and USD is a safer
                                                        bet.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBAnimation>
        )
    }
}

export default NoWebThree;