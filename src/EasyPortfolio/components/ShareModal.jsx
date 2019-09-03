import "react-sharingbuttons/dist/main.css";
import React, { Component } from "react";
import {
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBAlert
} from "mdbreact";

import { Facebook, Twitter, Reddit } from "react-sharingbuttons";

//https://caspg.github.io/react-sharingbuttons/

class ShareModal extends Component {
  state = { copied: false };
  copyToClipboard = e => {
    e.preventDefault();
    console.log("copy to clipboard");

    navigator.clipboard.writeText(this.props.shareLink).then(
      () => {
        /* clipboard successfully set */
        console.log("copied to clipboard");
        this.setState({ copied: true });
      },
      function() {
        /* clipboard write failed */
        console.log("failed copy to clipboard");
      }
    );
  };

  render() {
    return (
      <MDBContainer>
        {this.state.copied === true ? (
          <MDBAlert color="success">
            <MDBRow className="h-100 align-items-center">
              <MDBCol>
                <p style={{ textAlign: "center" }}> Copied!</p>
              </MDBCol>
            </MDBRow>
          </MDBAlert>
        ) : (
          ""
        )}

        {/* MODAL */}
        <MDBModal isOpen={this.props.modal} toggle={this.props.toggle}>
          <MDBModalHeader toggle={this.props.toggle}>
            Share Your Tokenfolio
          </MDBModalHeader>
          <MDBModalBody>
            <p>Share your current Tokenfolio:</p>
            <a href="#" onClick={this.copyToClipboard}>
              <MDBIcon size="2x" far icon="copy" />
            </a>
            <a style={{ fontSize: 14 }} href={this.props.shareLink}>
              {"   "}
              {this.props.shareLink}
            </a>

            <MDBRow className="h-100 align-items-center">
              <MDBCol>
                <div>
                  <Facebook
                    url={this.props.shareLink}
                    shareText="Check out my Tokenfolio!"
                  />
                  <Twitter
                    url={this.props.shareLink}
                    shareText="Check out my Tokenfolio!"
                  />
                  <Reddit
                    url={this.props.shareLink}
                    shareText="Check out my Tokenfolio!"
                  />
                </div>
              </MDBCol>
            </MDBRow>
          </MDBModalBody>
        </MDBModal>
      </MDBContainer>
    );
  }
}
export default ShareModal;
