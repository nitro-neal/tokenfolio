import React, { Component } from "react";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter
} from "mdbreact";

class ShareModal extends Component {
  render() {
    return (
      <MDBContainer>
        {/* MODAL */}
        <MDBModal isOpen={this.props.modal} toggle={this.props.toggle}>
          <MDBModalHeader toggle={this.props.toggle}>
            Share Your Tokenfolio
          </MDBModalHeader>
          <MDBModalBody>
            <p>Share your current alloications:</p>
            {this.props.shareLink}
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.props.toggle}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}
export default ShareModal;
