import React from "react";

import { MDBRow, MDBBtn, MDBCol } from "mdbreact";

const centerWithTopPadding = {
  textAlign: "center",
  paddingTop: "15px"
};

class FileInput extends React.Component {
  state = {
    fileContent: "",
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

        // this.props.walletFileUploaded(event.target.result, this.state.pass);
        this.setState({ fileContent: event.target.result });
      };

      reader.readAsText(file);
    }
  };

  onChangePass = event => {
    this.setState({ pass: event.target.value });
  };

  onClickUnlockWallet = () => {
    this.props.walletFileUploaded(this.state.fileContent, this.state.pass);
  };

  render() {
    return (
      <div>
        <MDBRow
          style={{ width: "22rem", marginTop: "1rem" }}
          className="h-100 align-items-center"
        >
          <p>Select your keystore file</p>
        </MDBRow>
        <MDBRow
          style={{ marginTop: "1rem" }}
          className="h-100 align-items-center"
        >
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroupFileAddon01">
                {this.state.fileContent === "" ? (
                  <> Upload keystore file </>
                ) : (
                  <svg
                    style={{ width: "22px", height: "22px" }}
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
                )}
              </span>
            </div>
            <div className="custom-file">
              <input
                type="file"
                icon="icon-plus"
                onChange={this.uploadFile}
                className="custom-file-input"
                id="inputGroupFile01"
                aria-describedby="inputGroupFileAddon01"
              />
              <label className="custom-file-label" htmlFor="inputGroupFile01">
                {this.state.fileContent === "" ? (
                  <>Choose file </>
                ) : (
                  <>File upload complete</>
                )}
              </label>
            </div>
          </div>
        </MDBRow>

        <MDBRow
          style={{ marginTop: "10px" }}
          className="h-100 align-items-center"
        >
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

        <MDBRow
          style={{ marginTop: "1rem" }}
          className="h-100 align-items-center"
        >
          <MDBCol style={centerWithTopPadding}>
            <MDBBtn onClick={this.onClickUnlockWallet} color="indigo">
              Unlock Wallet Now
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </div>
    );
  }
}

export default FileInput;
