import React from "react";

// https://codepen.io/anon/pen/KjgrmE
class ToggleSwitch extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			checked: false
		};
		
        this.onToggleSwitchChange = this.onToggleSwitchChange.bind(this);
	}
	
	onToggleSwitchChange() {
		this.setState({
			checked: !this.state.checked
        });
        
        this.props.toggleSwitch();
	}
    
    componentDidMount() {
        console.log('parentchecked')
        console.log(this.props.checked)
        var parentChecked = this.props.checked;
        this.setState({checked:parentChecked})
    }

	render() {
		return (
			<div className='ToggleSwitch ToggleSwitch__rounded'>
				<div className='ToggleSwitch__wrapper'>
					<div className={`Slider ${this.state.checked && 'isChecked'}`} onClick={this.onToggleSwitchChange}></div>
				</div>
			</div>
		);
	}
}


export default ToggleSwitch;