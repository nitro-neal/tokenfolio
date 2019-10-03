import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import FileInput from "./FileInput";

import { MDBContainer, MDBBtn, MDBCol } from "mdbreact";

const paddingTop = {
  paddingTop: "22px"
};

const centerWithTopPadding = {
  textAlign: "center",
  paddingTop: "15px"
};

class WalletSelector extends Component {
  render() {
    return (
      <MDBContainer className="mt-4">
        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
          <Tab eventKey="home" title="WalletConnect">
            <p style={paddingTop}>
              Scan a QR code to link your mobile wallet using{" "}
              <a
                rel="noopener noreferrer"
                href="https://walletconnect.org"
                target="_blank"
              >
                {" "}
                WalletConnect
              </a>
            </p>
            <p>
              Recommended Supported Wallets:{" "}
              <a
                rel="noopener noreferrer"
                href="https://trustwallet.com/"
                target="_blank"
              >
                {" "}
                Trust Wallet
              </a>
            </p>

            <MDBCol style={centerWithTopPadding}>
              <MDBBtn onClick={this.props.clickWalletConnect} color="indigo">
                Get WalletConnect QR Code
              </MDBBtn>
            </MDBCol>
          </Tab>
          <Tab eventKey="profile" title="Keystore File">
            <FileInput walletFileUploaded={this.props.walletFileUploaded} />
          </Tab>
          {/*<Tab eventKey="buy" title="Buy BNB">
            <script src="https://widget.changelly.com/affiliate.js"></script>{" "}
            <iframe
              title="buyBnb"
              src="https://widget.changelly.com?currencies=bnb,btc,eth&from=usd&to=bnb&amount=50&address=&fiat=true&fixedTo=true&theme=aqua&merchant_id=f05eec06a2ce&payment_id=Trust Wallet"
              width="100%"
              height="600"
              class="changelly"
              scrolling="no"
              onLoad="function ie(e){var t=e.target,n=t.parentNode,r=t.contentWindow,a=function(){return r.postMessage({width:n.offsetWidth},j.url)};window.addEventListener('resize',a),a()};ie.apply(this, arguments);"
              style={{
                minWidth: "100%",
                width: "100px",
                overflowY: "hidden",
                border: "none"
              }}
            >
              Can't load widget
            </iframe>
            </Tab>*/}
        </Tabs>
      </MDBContainer>
    );
  }
}

export default WalletSelector;
