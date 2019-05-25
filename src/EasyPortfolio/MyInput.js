import React from "react";
import { MDBInput } from "mdbreact";

const wrapperStyle = { marginLeft: '15%', marginRight :'15%' };

const MyInput = () => {
  return (
    // <MDBInput label="Add New Token" icon="angle-right" />
    <div style = {{'marginLeft': '15%', 'marginRight' :'15%', 'paddingBottom' :'25px'}}>
        <MDBInput  label="Add New Token"/>
    </div>
  );
}

export default MyInput;