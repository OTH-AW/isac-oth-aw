import React from 'react';

export default class LegendColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        console.log(this.props)
        let colors = ['#FF4500', '#FFAE42', '#9ACD32', '#0099CC', '#8A2BE2', '#D02090'];
        let color = colors[this.props.color];
        if(colors[this.props.color] === null) {
          color = 'grey'
        }
  
        var main = (
            <div className="col" style={{color: color}}>
                { this.props.name }
            </div>
        )

        return main;
    }
}