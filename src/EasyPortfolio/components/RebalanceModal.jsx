import React, { Component } from "react";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBContainer,
  MDBAnimation,
  MDBRow,
  MDBCol,
  Animation,
  MDBIcon,
  MDBBtn,
  MDBAlert
} from "mdbreact";

const centerText = {
  textAlign: "center"
};

const imageStyle = { width: "30px" };

const animationTypeLeft = "flipInX";
// const animationTypeRight = "flipInX";

class RebalanceModal extends Component {
  state = {};
  render() {
    let currentTrades = [];
    let confirmationsBools = this.props.confirmations.flatMap(conf => {
      return conf.complete;
    });
    let finished = confirmationsBools.includes(false) ? false : true;

    // let confirmed = [true, false, false];

    this.props.currentTrades.forEach((trade, index) => {
      currentTrades.push(
        <MDBAnimation
          key={trade.from + "-" + trade.to}
          type={animationTypeLeft}
        >
          <MDBRow style={centerText}>
            <MDBCol size={"3"}>
              <img
                alt={trade.from + "-" + trade.to}
                style={imageStyle}
                src={"./logos/" + trade.fromLogoName.toLowerCase() + ".png"}
              />
            </MDBCol>
            <MDBCol size={"1"}>
              <MDBIcon icon="angle-double-right" />
            </MDBCol>
            <MDBCol size={"3"}>
              <img
                alt={trade.from + "-" + trade.to}
                style={imageStyle}
                src={"./logos/" + trade.toLogoName.toLowerCase() + ".png"}
              />
            </MDBCol>
            <MDBCol size={"3"}>
              {this.props.confirmations[index].complete === false ? (
                <div
                  key={trade.from + "-" + trade.to}
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <Animation type="pulse" infinite>
                  <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </Animation>
              )}
            </MDBCol>
            <MDBCol size={"1"}>
              {this.props.confirmations[index].error === true ? (
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://docs.binance.org/faq.html#what-are-the-tick-size-and-lot-size-are-they-fixed"
                >
                  <MDBIcon icon="exclamation-triangle" />
                </a>
              ) : (
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={this.props.confirmations[index].url}
                >
                  <MDBIcon icon="external-link-alt" />
                </a>
              )}
            </MDBCol>
          </MDBRow>
        </MDBAnimation>
      );
    });

    return (
      <MDBModal size="lg" isOpen={this.props.modal} toggle={this.props.toggle}>
        <MDBModalHeader>
          <Animation type="pulse" infinite>
            <a href="#">REBALANCING...</a>
          </Animation>
        </MDBModalHeader>
        <MDBModalBody>
          <MDBContainer fluid>
            {currentTrades}
            {finished === true ? (
              <MDBAnimation key={"complete"} type="zoomInLeft">
                <MDBRow style={{ textAlign: "center", paddingTop: "15px" }}>
                  <MDBCol size={"12"}>
                    <MDBAlert color="success">
                      <h5>
                        Rebalancing Complete <MDBIcon icon="rocket" />
                      </h5>
                    </MDBAlert>
                  </MDBCol>
                </MDBRow>
                <MDBRow style={{ textAlign: "center" }}>
                  <MDBCol size={"12"}>
                    <MDBBtn onClick={this.props.reset} color="indigo">
                      Balance Again?
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBAnimation>
            ) : (
              ""
            )}
          </MDBContainer>
        </MDBModalBody>
      </MDBModal>
    );
  }
}

export default RebalanceModal;
