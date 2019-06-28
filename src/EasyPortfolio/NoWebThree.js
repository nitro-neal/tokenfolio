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
    MDBModalHeader,
    MDBModalBody,
    Button,
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
            assets: []
        }

    }

    toggleit = () => {
        this.setState({
            toggle: !this.state.toggle
        })
    }

    componentDidMount() {
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
        //+= "&autoplay=1
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

                        <MDBModal
                            isOpen={this.state.toggle}
                            toggle={this.toggleit}
                            size="large"
                            // frame="frame"
                            position="top">
                            <div class="video-container">
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
                                <MDBCardBody>

                                 
                                    <div >
                                        {/* cryptofolio */}
                                        {/* <a href = {"/"} > <h1>Tokenfolio</h1> </a> */}

                                        <img class="img-fluid" alt="Tokenfolio logo" src="tflogo.png"></img>
                                        <hr className="my-4"/>
                                    </div>

                                    <h4>Create a portfolio of ethereum tokens directly from your wallet in an
                                        instant, secure and convenient way.</h4>

                                    {/* <Button onClick={this.toggleit}>Demo</Button> */}
                                    <hr className="my-4"/>

                                    <a href="#" onClick={this.toggleit} backgroundColor="#2d323e" color="#2d323e">
                                        <h4>View Demo</h4>
                                    </a>
                                    <a href="#" onClick={this.toggleit} backgroundColor="#2d323e" color="#2d323e">
                                        <img src="play.png"></img>
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
                                    <h4>Change the sliders and click Rebalance!</h4>
                                    <ShowPieChart assets={this.state.assets}/> {
                                        this.state.usdValue === -1
                                            ? <div key="usdvalue" className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            : <p style={textAlignCenter}>USD Value: ${Math.round(this.state.totalUsdValue * 100) / 100}</p>
                                    }
                                    {/*  <a href = {"/"} ><img alt="tokenfolio" src="./tokenfolio-logo.png" ></img> <
 * /a> 
 */
                                    }

                                </div>

                                <MDBRow className="h-100 align-items-center">
                                    <MDBCol>
                                        <AssetSlider
                                            totalUsdValue={this.state.totalUsdValue}
                                            totalPercentage={this.state.totalPercentage}
                                            changeSlider={this.changeSlider}
                                            assets={this.state.assets}/>

                                        <MDBBtn onClick={this.fakeKyberTrade} color="indigo">Rebalance</MDBBtn>

                                        {this.state.fakeKyberTradeToggle === false ?
                                            ""
                                        :
                                        
                                        <MDBAnimation key = "instruction" type="flipInX">
                                        <hr className="my-4"/>
                                        <div>
                                            <h4>This Dapp is made on top of Ethereum blockchain. To use this Dapp</h4>
                                            <p>For desktop install - <a rel="noopener noreferrer" target="_blank" href="https://metamask.io/">metamask extension.</a></p> 
                                            <p>For Android/IOS download ethereum browser - <a rel="noopener noreferrer" target="_blank" href="https://trustwallet.com">Trust wallet</a></p>
                                        </div>
                                        </MDBAnimation>
                                        }
                                    </MDBCol>
                                </MDBRow>
                            </MDBJumbotron>

                            <div class="row">
                                <div class="col-12 col-lg-4">
                                    <div class="card features">
                                        <div class="card-body">
                                            <div class="media">
                                                {/* <span class="ti-face-smile gradient-fill ti-3x mr-3"></span> */}
                                                {/* <MDBIcon icon="external-link-alt" /> */}
                                                <div class="media-body">
                                                    <h4 class="card-title">Simple!</h4>
                                                    <p class="card-text">But first you need a web3 wallet.</p>
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
                                <div class="col-12 col-lg-4">
                                    <div class="card features">
                                        <div class="card-body">
                                            <div class="media">
                                                <span class="ti-settings gradient-fill ti-3x mr-3"></span>
                                                <div class="media-body">
                                                    <h4 class="card-title">What the hell is a web3 wallet?</h4>
                                                    <p class="card-text">A web3 wallet allows you to manage your Ethereum and
                                                        Ethereum tokens. This allows you to visit the distributed web of tomorrow in
                                                        your browser.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-4">
                                    <div class="card features">
                                        <div class="card-body">
                                            <div class="media">
                                                <span class="ti-lock gradient-fill ti-3x mr-3"></span>
                                                <div class="media-body">
                                                    <h4 class="card-title">Don't be a nocoiner.</h4>
                                                    <p class="card-text">A nocoiner is a person who owns no cryptocurrencies and
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