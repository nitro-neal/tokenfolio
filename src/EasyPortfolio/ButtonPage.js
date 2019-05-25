import React, { Fragment } from "react";
import { MDBBtn } from "mdbreact";

const ButtonPage = () => {
  return (
    <Fragment>
      <MDBBtn color="primary">Primary</MDBBtn>
      <MDBBtn>Default</MDBBtn>
      <MDBBtn color="secondary">Secondary</MDBBtn>
      <MDBBtn color="success">Success</MDBBtn>
      <MDBBtn color="info">Info</MDBBtn>
      <MDBBtn color="warning">Warning</MDBBtn>
      <MDBBtn color="danger">Danger</MDBBtn>
      <MDBBtn gradient="peach">Peach</MDBBtn>
      <MDBBtn gradient="purple">Purple</MDBBtn>
      <MDBBtn gradient="blue">Blue</MDBBtn>
      <MDBBtn gradient="aqua">Aqua</MDBBtn>
    </Fragment>
  );
}

export default ButtonPage;