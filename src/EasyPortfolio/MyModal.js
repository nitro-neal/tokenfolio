/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { MDBModal, MDBModalHeader, MDBModalBody, MDBContainer , MDBAnimation, MDBRow, MDBCol, Animation, MDBIcon, MDBAlert } from "mdbreact";

class MyModal extends React.Component {

    constructor(props) {
        super(props)
    
        this.state = {}
      }

    componentDidMount() {

    }

    render() {

        const imageStyle = {width : '30px'}
        var currentTxs = [];

        this.props.currentApprovals.forEach(approval => {
            currentTxs.push(
                <MDBAnimation key = {approval} type="zoomInLeft">
                <MDBRow style={{"textAlign": "center"}}>
                    <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + approval.toLowerCase() + ".png"}/> </MDBCol>
                    <MDBCol size={"1"}>
                        <MDBIcon icon="angle-double-right" />
                    </MDBCol>
                    
                    <MDBCol size={"3"}> <MDBIcon far icon="thumbs-up" /> </MDBCol>
                    <MDBCol size={"3"}>

                    {this.props.tradeConfirmations.get(approval + "-approval") === undefined ?
                    <Animation type="pulse" infinite>
                        <p>...</p>
                    </Animation>
                    :
                    ""
                    } 

                    {this.props.tradeConfirmations.get(approval + "-approval") !== undefined && this.props.tradeConfirmations.get(approval + "-approval").split('-')[0] === "tx" ?
                    <div key = {approval + "-" + approval} className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    ""
                    } 

                    {this.props.tradeConfirmations.get(approval + "-approval") !== undefined && this.props.tradeConfirmations.get(approval + "-approval").split('-')[0] === "comf" ?
                    
                    <Animation type="pulse" infinite>
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                    </Animation>
                    :
                    ""
                    }

                </MDBCol>

                <MDBCol size={"1"}>
                    <a rel="noopener noreferrer" target= "_blank" href = {"https://etherscan.io/"}> <MDBIcon icon="external-link-alt" /></a>
                </MDBCol>

                </MDBRow>
                </MDBAnimation>
            );
        })

        this.props.currentTrades.forEach(trade => {
            currentTxs.push(
                <MDBAnimation key ={trade.from + "-" + trade.to} type="zoomInLeft">
                <MDBRow style={{"textAlign": "center"}}>
                    <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + trade.from.toLowerCase() + ".png"}/> </MDBCol>
                    <MDBCol size={"1"}>
                        <MDBIcon icon="angle-double-right" />
                    </MDBCol>
                    <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + trade.to.toLowerCase() + ".png"}/> </MDBCol>
                    <MDBCol size={"3"}>

                    {this.props.tradeConfirmations.get(trade.from + "->" +trade.to) === undefined ?
                    <Animation type="pulse" infinite>
                        <p>...</p>
                    </Animation>
                    :
                    ""
                    } 

                    {this.props.tradeConfirmations.get(trade.from + "->" +trade.to) !== undefined && this.props.tradeConfirmations.get(trade.from + "->" +trade.to).split('-')[0] === "tx" ?
                    <div key = {trade.from + "-" + trade.to} className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    ""
                    } 

                    {this.props.tradeConfirmations.get(trade.from + "->" +trade.to) !== undefined && this.props.tradeConfirmations.get(trade.from + "->" +trade.to).split('-')[0] === "comf" ?
                    
                    <Animation type="pulse" infinite>
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                    </Animation>
                    :
                    ""
                    }

                </MDBCol>

                <MDBCol size={"1"}>
                    {this.props.tradeConfirmations.get(trade.from + "->" +trade.to) !== undefined ?
                    <a rel="noopener noreferrer" target= "_blank" href = {"https://etherscan.io/tx/" + this.props.tradeConfirmations.get(trade.from + "->" +trade.to).split('-')[1]} ><MDBIcon icon="external-link-alt" /></a>
                    :
                    ""
                    }
                </MDBCol>

                </MDBRow>
                </MDBAnimation>
            );
        })

        var finished = false;
        var totalComfirmations = 0;

        for(var i = 0; i < this.props.currentTrades.length; i++ ){
            var trade = this.props.currentTrades[i];
            if(this.props.tradeConfirmations.get(trade.from + "->" +trade.to) !== undefined && this.props.tradeConfirmations.get(trade.from + "->" +trade.to).split('-')[0] === "comf") {
                totalComfirmations ++;
            }
        }

        // eslint-disable-next-line no-redeclare
        for(var i = 0; i < this.props.currentApprovals.length; i++ ){
            var approval = this.props.currentApprovals[i];
            if(this.props.tradeConfirmations.get(approval + "-approval") !== undefined && this.props.tradeConfirmations.get(approval + "-approval").split('-')[0] === "comf") {
                totalComfirmations ++;
            }
        }

        if(totalComfirmations !== 0 && totalComfirmations === (this.props.currentApprovals.length + this.props.currentTrades.length )) {
            finished = true;
        }

        return (
            <MDBModal size = "lg" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <MDBModalHeader toggle={this.props.toggle}> <Animation type="pulse" infinite><a href="#" >REBALANCING...</a></Animation> </MDBModalHeader>
                    <MDBModalBody>
                        <MDBContainer fluid>
                            {currentTxs}
                            {finished === true ?
                            <MDBAnimation key ={"complete"} type="zoomInLeft">
                                <MDBRow style={{"textAlign": "center", "paddingTop" : "15px"}}>
                                    <MDBCol size={"12"}>
                                    <MDBAlert color="success"> 
                                        <h5>Rebalancing Complete  <MDBIcon icon="rocket" /></h5> 
                                        </MDBAlert>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow style={{"textAlign": "center"}}>
                                <MDBCol size={"12"}>
                                <a href="/">Balance Again?</a>
                                </MDBCol>
                                </MDBRow>
                            </MDBAnimation>
                            :
                            ""
                            }
                        </MDBContainer>
                    </MDBModalBody>
                </MDBModal>
          );
    }
}

export default MyModal;