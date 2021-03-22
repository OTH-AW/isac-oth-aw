import React from 'react';
import 'font-awesome/css/font-awesome.css';

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        var main = (
            <div className={`card text-center ${this.props.className}`}>
                <div className="d-flex flex-column card-body">
                    <h5 className="card-title">
                        <strong>
                            {this.props.title}
                        </strong>
                    </h5>
                    <p className="card-text">{this.props.description}</p>
                    <div className="mt-auto">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )

        return main;
    }
}