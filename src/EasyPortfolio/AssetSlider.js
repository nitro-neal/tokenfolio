import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import React from 'react';
import Slider from 'rc-slider';

// import {Container, Row, Col} from 'react-bootstrap';
import {MDBContainer, MDBRow, MDBCol, MDBAnimation } from "mdbreact";


const wrapperStyle = { marginLeft: '15%', marginRight :'15%' };
const imageStyle = {width : '30px'}
var colorMap = new Map();

class AssetSlider extends React.Component {
    constructor(props) {
      super(props)
  
      this.state = {}
    }

    componentDidMount() {
        colorMap.set('BTC', {"backgroundColor" : "orange", "borderColor" : "orange"});
        colorMap.set('WBTC', {"backgroundColor" : "orange", "borderColor" : "orange"});
        colorMap.set('ETH', {"backgroundColor" : "#12100B", "borderColor" : "#12100B"});
        colorMap.set('BAT', {"backgroundColor" : "red", "borderColor" : "red"});
        colorMap.set('DAI', {"backgroundColor" : "yellow", "borderColor" : "yellow"});
        colorMap.set('OMG', {"backgroundColor" : "blue", "borderColor" : "blue"});
        colorMap.set('MANA', {"backgroundColor" : "green", "borderColor" : "green"});
    }

    render() {

        var myStyle = {"backgroundColor" : "grey"}
        var textAlignRight = {"textAlign" :"right" }
        var textAlignLeft = {"textAlign" :"left" }
        // var myHandleStyle = {"background-color" : "red", "border-color" : "red"}
        // var myColorMap = colorMap;

        var sortedAssets = [];

        this.props.assets.map((asset) => {
            sortedAssets.push(asset);
        });

        sortedAssets.sort( function(a, b) {
            if(a.symbol === 'ETH') {
                return a;
            }

            return a.symbol-b.symbol
        })


        // console.log(sortedAssets)

        var items = []
        sortedAssets.forEach((asset) => {
            var computedValue = asset.newPortfolioPercent;

            items.push(
                <MDBContainer key ={asset.symbol}>
                <MDBAnimation key = {asset.symbol} type="slideInRight">
                <div key = {asset.symbol}>
                
                    
                        <MDBRow>
                        <MDBCol size={"2"}> <img alt ="" style ={imageStyle} src={"./logos/" + asset.symbol.toLowerCase() + ".png"}/> </MDBCol>
                            <MDBCol size={"7"}> <p style = {textAlignLeft} className="herotext"> {asset.tokenName}  ({asset.symbol}) </p></MDBCol>
                            <MDBCol size={"3"}> <p style = {textAlignRight}  className="herotext">   {Math.round(asset.newPortfolioPercent)} % </p></MDBCol>
                        </MDBRow>
                
                

                        <MDBRow>
                        <MDBCol>
                <div key={asset.symbol} style={wrapperStyle}>
                    {/* {asset.symbol} => {Math.round(asset.newPortfolioPercent)} */}
                    {/* <p>{asset.tokenName}</p> */}
                    {/* <p>OLD PERCENT: {Math.round(asset.currentPortfolioPercent)} </p>
                    <p>NEW PERCENT: {Math.round(asset.newPortfolioPercent)} </p>
                    <p>AMOUNT: {asset.amount}</p>
                    <p>PRICE PER ASSET: {asset.pricePerAsset} </p>
                    <p>USD VALUE: {asset.usdValue} </p>
                    <p>NEW USD VALUE: {asset.newPercentUsdValue} </p> */}
                    {/* <p class="herotext"> <img alt ="" style ={imageStyle} src={"./logos/" + asset.symbol.toLowerCase() + ".png"}/> <span class={textAlignLeft}> {asset.tokenName}  ({asset.symbol}) </span> <span style ={textAlignRight} > {Math.round(asset.newPortfolioPercent)} </span> </p> */}
                    <Slider trackStyle = {colorMap.get(asset.symbol)} handleStyle={colorMap.get(asset.symbol)} railStyle = {myStyle} min={0} max={100} defaultValue={5} value = {computedValue} onChange={(e) => this.props.changeSlider(asset,e)} />
                </div>
                </MDBCol>
                </MDBRow>
                </div>
                </MDBAnimation>
                </MDBContainer>
                
            )
        })


        return (

            <div>
                {items}
            </div>
        );
    }
  }

  export default AssetSlider;