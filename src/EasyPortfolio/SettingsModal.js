import React from "react";
import { MDBModal, MDBModalHeader, MDBModalBody, MDBContainer , MDBAnimation, MDBRow, MDBCol, Animation, MDBIcon, MDBAlert } from "mdbreact";

class SettingsModal extends React.Component {

    constructor(props) {
        super(props)
    
        this.state = {}
      }

    componentDidMount() {

    }

    render() {
        return (

              <MDBModal isOpen={this.state.modal14} toggle={this.toggle(14)} centered>
                <MDBModalHeader toggle={this.toggle(14)}>Settings</MDBModalHeader>
                <MDBModalBody>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
                  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat.
                </MDBModalBody>
              </MDBModal>
            
          );
    }
}

export default SettingsModal;



