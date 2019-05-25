import React, { Fragment } from "react";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBAnimation } from "mdbreact";
import MyLogo from "./MyLogo";
import ShowPieChart from "./PieChart";
import AssetSlider from "./AssetSlider";
import ButtonPage from "./ButtonPage";

var DEBUG = true;

class EasyPortfolioContainer extends React.Component {
    constructor(props) {
      super(props)
  
      this.state = {
        assets: []
      }
    }

    componentDidMount() {

        if(DEBUG) {
            this.addTestAssets();
        }
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
    
    render() {
        return (

            // <div className="bg">
            
            <MDBContainer className = "h-100">
                <MDBRow className = "h-100 align-items-center">
                    <MDBAnimation type="slideInLeft">
                        <MDBCol className = "col-example" md="5">
                            <div className = "logo">
                                <a href = {"#"} >Cryptofolio</a>
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
                                    <AssetSlider changeSlider = {this.changeSlider} assets = {this.state.assets} />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow className = "h-100 align-items-center">
                                <MDBCol style = {{"textAlign": "center", "paddingTop" : "40px"}}>
                                    <MDBBtn color="primary">Primary</MDBBtn>
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