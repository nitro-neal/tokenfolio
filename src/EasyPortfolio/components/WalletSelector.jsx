import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import FileInput from "./FileInput";

import { MDBContainer } from "mdbreact";

class WalletSelector extends Component {
  render() {
    return (
      <MDBContainer className="mt-4">
        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
          <Tab eventKey="home" title="Keystore File">
            <FileInput walletFileUploaded={this.props.walletFileUploaded} />
          </Tab>
          <Tab eventKey="profile" title="WalletConnect">
            <p>WalletConnect (Recommended)</p>
            <p>
              Scan a QR code to link your mobile wallet using WalletConnect.
            </p>
            <p>
              Recommended Supported Wallets: <span>Trust Wallet </span>
            </p>

            <h1>Coming Soon</h1>
          </Tab>
        </Tabs>
      </MDBContainer>
    );
  }
}

export default WalletSelector;
