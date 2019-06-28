import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

class VideoModal extends Component {
  state = {
    modal: false
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    return (
      <MDBContainer>
        {/* BUTTON */}
        <MDBBtn color="info" onClick={this.toggle}>Click</MDBBtn>
        {/* MODAL */}
        <MDBModal isOpen={this.state.modal} toggle={this.toggle}   size="fluid"  >
          <MDBModalHeader toggle={this.toggle}>MDBModal title</MDBModalHeader>
          <MDBModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
            <MDBBtn color="primary">Save changes</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}
export default VideoModal;