import React from 'react';
import FA from 'react-fontawesome';

export default class StatusNode extends React.Component {

  render() {
    var main = (
        <div className="timeline">
            <div className="timeline-content">
                <div className="circle"><span><i className={this.props.data.icon}></i></span></div>
                <div className="content">
                    <span className="year"><span><FA name="calendar"/>{" " + this.props.data.date + " "}<FA name="clock-o"/>{" " + this.props.data.time + " "}</span></span>
                    <h4 className="title">{this.props.data.title}</h4>
                    <p className="description">
                        {this.props.data.description}
                    </p>
                    <div className="icon"><span></span></div>
                </div>
            </div>
        </div>
    )      
    return(main)
  }
} 