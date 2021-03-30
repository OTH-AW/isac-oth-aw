import React from 'react';

export default class Checkable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        var main = (
            <div className={"custom-control custom-" + this.props.type + " col-md"}>
                <input 
                    type={this.props.type} 
                    className="custom-control-input" 
                    id={this.props.id} 
                    name={this.props.group} 
                    value={this.props.value}
                    checked={this.props.checked}
                    onChange={this.props.handler}
                />
                <label className="custom-control-label" htmlFor={this.props.id}>{this.props.label}</label>
            </div>
        )
        if(this.props.disabling) {
            main = (
                <div className={"custom-control custom-" + this.props.type + " col-md"}>
                    <input 
                        type={this.props.type} 
                        className="custom-control-input" 
                        id={this.props.id} 
                        name={this.props.group} 
                        value={this.props.value}
                        checked={this.props.checked}
                        onChange={this.props.handler}
                        disabled
                    />
                    <label className="custom-control-label" htmlFor={this.props.id}>{this.props.label}</label>
                </div>
            )
        }

        return main;
    }
}