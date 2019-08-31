import React, { Component } from "react";

import GLOBALS from "./Globals";

import {
  MDBRow,
  MDBCol,
  MDBAnimation,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBIcon
} from "mdbreact";

import ShareModal from "./ShareModal";

class Footer extends Component {
  state = {
    modal: false
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <>
        <MDBRow className="h-100 align-items-center">
          <MDBCol style={GLOBALS.centerWithTopPadding}>
            <p>
              Powered by
              <a
                rel="noopener noreferrer"
                href="https://www.binance.org/"
                target="_blank"
              >
                {" "}
                Binance Chain
              </a>
            </p>
          </MDBCol>
        </MDBRow>
        <MDBRow className="h-100 align-items-center">
          <MDBCol style={GLOBALS.textAlignCenter}>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://twitter.com/tokenfolio"
            >
              <MDBIcon fab icon="twitter" />
            </a>

            <a
              style={GLOBALS.paddingLeft}
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/nitro-neal/tokenfolio"
            >
              <MDBIcon fab icon="github" />
            </a>

            <a
              style={GLOBALS.paddingLeft}
              href="#"
              onClick={this.props.shareToggle}
            >
              <MDBIcon icon="share" />
            </a>
          </MDBCol>
        </MDBRow>
      </>
    );
  }
}

export default Footer;
