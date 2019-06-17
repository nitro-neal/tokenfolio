import React from "react";
import { MDBContainer, MDBRow } from "mdbreact";

const LoadingPage = () => {
    return (
        <MDBContainer className = "h-100">
            <MDBRow className = "h-100 align-items-center">
                <div style = {{marginLeft: "50%"}} className="spinner-grow text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </MDBRow>
        </MDBContainer>
    );
}

export default LoadingPage;