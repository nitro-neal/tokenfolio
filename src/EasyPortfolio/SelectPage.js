import React, {Component} from "react";

class SelectPage extends Component {

    render() {

        if (this.props.availTokens === []) {
            return;
        }

        var sortedAssets = this
            .props
            .availTokens
            .sort();

        var items = []

        sortedAssets.forEach((asset) => {
            items.push(<option key={asset} value={asset}>{asset}</option>)
        })

        return (
            <div
                style={{
                    'marginLeft' : '15%',
                    'marginRight' : '15%',
                    'paddingBottom' : '25px'
                }}>
                <select
                    onChange={this.props.handleSelect}
                    className="browser-default custom-select">
                    <option>Add a cryptocurrency to your portfolio</option>
                    {items}
                </select>
            </div>
        );
    }
}

export default SelectPage;