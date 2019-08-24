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
        </Tabs>
      </MDBContainer>
    );
  }
}

export default WalletSelector;
