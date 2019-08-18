import React from "react";

import { MDBRow } from "mdbreact";

class FileInput extends React.Component {
  state = {
    pass: ""
  };

  uploadFile = event => {
    let file = event.target.files[0];
    console.log(file);

    if (file) {
      var reader = new FileReader();
      reader.onload = event => {
        // The file's text will be printed here
        // console.log(event.target.result);
        // console.log("pass: " + this.state.pass);

        this.props.walletFileUploaded(event.target.result, this.state.pass);
      };

      reader.readAsText(file);
    }
  };

  onChangePass = event => {
    this.setState({ pass: event.target.value });
  };

  render() {
    return (
      <div>
        <MDBRow className="h-100 align-items-center">
          <p>Select your keystore file</p>
        </MDBRow>
        <MDBRow className="h-100 align-items-center">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroupFileAddon01">
                Upload
              </span>
            </div>
            <div className="custom-file">
              <input
                type="file"
                onChange={this.uploadFile}
                className="custom-file-input"
                id="inputGroupFile01"
                aria-describedby="inputGroupFileAddon01"
              />
              <label className="custom-file-label" htmlFor="inputGroupFile01">
                Choose file
              </label>
            </div>
          </div>
        </MDBRow>

        <MDBRow className="h-100 align-items-center">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon">
                <i className="fa fa-user prefix" />
              </span>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your wallet password"
              aria-label="Enter your wallet password"
              aria-describedby="basic-addon"
              onChange={this.onChangePass}
            />
          </div>
        </MDBRow>
      </div>
    );
  }
}

export default FileInput;
