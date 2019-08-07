import React, { Component } from "react";

class SelectDropdown extends Component {
  render() {
    let items = [];

    if (this.props.binanceAssets !== null) {
      let assets = this.props.binanceAssets.map(asset => asset.friendlyName);

      let sortedAssets = assets.sort();

      sortedAssets.forEach(asset => {
        items.push(
          <option key={asset} value={asset}>
            {asset}
          </option>
        );
      });
    }

    return (
      <div
        style={{
          marginLeft: "15%",
          marginRight: "15%",
          paddingBottom: "25px"
        }}
      >
        <select
          onChange={this.props.handleSelect}
          className="browser-default custom-select"
        >
          <option>Add a cryptocurrency to your portfolio</option>
          {items}
        </select>
      </div>
    );
  }
}

export default SelectDropdown;
