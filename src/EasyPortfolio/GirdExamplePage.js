import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";



const GridExamplesPage = () => {
  
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol className = "col-example" size="4">.col-4</MDBCol>
        <MDBCol className = "col-example" size="4">.col-4</MDBCol>
        <MDBCol className = "col-example" size="4">.col-4</MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol className = "col-example" sm="4">.col-sm-4</MDBCol>
        <MDBCol className = "col-example" sm="4">.col-sm-4</MDBCol>
        <MDBCol className = "col-example" sm="4">.col-sm-4</MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol className = "col-example" md="4">.col-md-4</MDBCol>
        <MDBCol className = "col-example" md="4">.col-md-4</MDBCol>
        <MDBCol className = "col-example" md="4">.col-md-4</MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol className = "col-example" lg="4">.col-lg-4</MDBCol>
        <MDBCol className = "col-example" lg="4">.col-lg-4</MDBCol>
        <MDBCol className = "col-example" lg="4">.col-lg-4</MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol className = "col-example" xl="4">.col-xl-4</MDBCol>
        <MDBCol className = "col-example" xl="4">.col-xl-4</MDBCol>
        <MDBCol className = "col-example" xl="4">.col-xl-4</MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default GridExamplesPage;