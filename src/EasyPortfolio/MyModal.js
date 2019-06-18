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
                <MDBRow style={{"text-align": "center"}}>
                    <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + approval.toLowerCase() + ".png"}/> </MDBCol>
                    <MDBCol size={"1"}>
                        <MDBIcon icon="angle-double-right" />
                    </MDBCol>
                    
                    {/* <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + approval.toLowerCase() + ".png"}/> </MDBCol> */}
                    <MDBCol size={"3"}> <MDBIcon far icon="thumbs-up" /> </MDBCol>
                    {/* <MDBCol sm={"6"}> <a href="https://ropsten.etherscan.io/tx/0x6dbcb6eaca690eef54d08733fede54f21baf125400ed8ee08af71a8c5605c0ed"> > </a> </MDBCol> */}
                    <MDBCol size={"4"}>

                    {this.props.tradeConfirmations.get(approval + "-approval") === undefined ?
                    <Animation type="pulse" infinite>
                        <p>Waiting for approval from your wallet...</p>
                    </Animation>
                    :
                    ""
                    } 

                    {/*{this.props.tradeConfirmations.get(approval + "-approval").split('-')[0] === "tx" ? */}
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
                {/* https://ropsten.etherscan.io/tx/0xa3188fcc21025d26ede9e80d55422e8f223efec3b505679668969a741fe9b021 */}
                    {/* {this.props.tradeConfirmations.get(trade.from + "->" +trade.to) !== undefined ?
                    <a rel="noopener noreferrer" target= "_blank" href = {"https://etherscan.io/tx/" + this.props.tradeConfirmations.get(trade.from + "->" +trade.to).split('-')[1]} ><MDBIcon icon="external-link-alt" /></a>
                    :
                    ""
                    } */}
                </MDBCol>

                </MDBRow>
                </MDBAnimation>
            );
        })

        this.props.currentTrades.forEach(trade => {
            currentTxs.push(
                <MDBAnimation key ={trade.from + "-" + trade.to} type="zoomInLeft">
                <MDBRow style={{"text-align": "center"}}>
                    <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + trade.from.toLowerCase() + ".png"}/> </MDBCol>
                    <MDBCol size={"1"}>
                        <MDBIcon icon="angle-double-right" />
                    </MDBCol>
                    <MDBCol size={"3"}> <img alt ="" style ={imageStyle} src={"./logos/" + trade.to.toLowerCase() + ".png"}/> </MDBCol>
                    {/* <MDBCol sm={"6"}> <a href="https://ropsten.etherscan.io/tx/0x6dbcb6eaca690eef54d08733fede54f21baf125400ed8ee08af71a8c5605c0ed"> > </a> </MDBCol> */}
                    <MDBCol size={"4"}>

                    {this.props.tradeConfirmations.get(trade.from + "->" +trade.to) === undefined ?
                    <Animation type="pulse" infinite>
                        <p>Waiting for confirmation from your wallet...</p>
                    </Animation>
                    :
                    ""
                    } 

                    {console.log("TX VALUE")}
                    {console.log(this.props.tradeConfirmations.get(trade.from + "->" +trade.to))}
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
                {/* https://ropsten.etherscan.io/tx/0xa3188fcc21025d26ede9e80d55422e8f223efec3b505679668969a741fe9b021 */}
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
            // console.log('CURRENT TRADES FOR COMF CHECK')
            // console.log(this.props.tradeConfirmations.get(trade.from + "->" +trade.to))
            if(this.props.tradeConfirmations.get(trade.from + "->" +trade.to) !== undefined && this.props.tradeConfirmations.get(trade.from + "->" +trade.to).split('-')[0] === "comf") {
                totalComfirmations ++;
            }
        }

        for(var i = 0; i < this.props.currentApprovals.length; i++ ){
            var approval = this.props.currentApprovals[i];
            if(this.props.tradeConfirmations.get(approval + "-approval") !== undefined && this.props.tradeConfirmations.get(approval + "-approval").split('-')[0] === "comf") {
                totalComfirmations ++;
            }
        }

        // console.log('total confirmations')
        // console.log(totalComfirmations)
        // console.log('both lenghts')
        // console.log(this.props.currentApprovals.length + this.props.currentTrades.length );
        if(totalComfirmations !== 0 && totalComfirmations === (this.props.currentApprovals.length + this.props.currentTrades.length )) {
            finished = true;
        }

        return (
            <MDBModal size = "lg" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <MDBModalHeader toggle={this.props.toggle}> Balancing in progress... </MDBModalHeader>
                    <MDBModalBody>
                        <MDBContainer fluid>
                            {currentTxs}
                            {finished === true ?
                            <MDBAnimation key ={"complete"} type="zoomInLeft">
                                <MDBRow style={{"text-align": "center"}}>
                                    {/* <MDBCol size={"12"}> <div className = "logo"> Rebalancing Complete! </div> <MDBIcon icon="rocket" /> </MDBCol> */}
                                    <MDBCol size={"12"}>
                                    <MDBAlert color="success"> 
                                        <h5>Rebalancing Complete  <MDBIcon icon="rocket" /></h5> 
                                        </MDBAlert>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow style={{"text-align": "center"}}>
                                <MDBCol size={"12"}>
                                <a href="/">Balance Again?</a>
                                </MDBCol>
                                </MDBRow>
                            </MDBAnimation>
                            :
                            ""
                            }
                            {/* <MDBRow>
                                <MDBCol md="12" className="bg-info">
                                    <h1> CURRENT TXs: </h1>
                                    {currentTxs}
                                </MDBCol>
                            </MDBRow> */}
                        </MDBContainer>
                    </MDBModalBody>
                </MDBModal>
          );
    }
}

export default MyModal;