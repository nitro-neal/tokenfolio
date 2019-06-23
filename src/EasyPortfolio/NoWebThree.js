import React from "react";
import { MDBJumbotron, MDBContainer, MDBRow, MDBCol, MDBIcon, MDBCardBody, MDBAnimation, MDBCardTitle } from "mdbreact";

const NoWebThree = () => {
  return (
    <MDBAnimation key ="noweb3" type="zoomInLeft">
    <MDBContainer className="mt-5 text-center">
      <MDBRow>
        <MDBCol>
          <MDBJumbotron>
            <MDBCardBody>
            <div className = "logo">
              {/* cryptofolio */}
              <a href = {"/"} > <h1>Tokenfolio</h1> </a>
              </div>

              <p>Create a portfolio of ethereum tokens directly from your wallet in an instant, secure and convenient way.</p>


              <div class="video-container">
            <iframe title="Tokenfolio" width="560" height="315" src="https://www.youtube.com/embed/FO-SnkFPWpA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>


              <MDBCardTitle style={{"padding-top" : "50px"}} className="h2">
                You need have a web3 wallet installed to use this app.
              </MDBCardTitle>
              <p className="blue-text my-4 font-weight-bold">
              <MDBIcon icon="rocket" /> It's easy! <MDBIcon icon="rocket" />
              </p>
              
              <hr className="my-4" />
              <div className="pt-2">
              
              <a rel="noopener noreferrer" target= "_blank" href = "https://brave.com/"> <h2>Get Brave Browser <MDBIcon icon="space-shuttle" /> </h2>  </a>
                <a rel="noopener noreferrer" target= "_blank" href = "https://metamask.io/"> <h2>Get Metamask Extention <MDBIcon icon="space-shuttle" /> </h2>  </a>
                
              </div>
            </MDBCardBody>
          </MDBJumbotron>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </MDBAnimation>
  )
}

export default NoWebThree;