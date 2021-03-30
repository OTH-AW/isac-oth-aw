import React from 'react';
import FA from "react-fontawesome";
import Chart from "./chart/chart.js";

// Rein visuelle Klasse, die Daten durchschleift
export default class ChartCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visuals: {
                notificationCard: "chevron-down",
                commandsCard: "chevron-down",
                powerCard: "chevron-down"
            }
        }

        this.handleClick = this.handleClick.bind(this);
    }

    // Kümmert sich um die Visuelle Darstellung einer Bootstrap Card
    handleClick(e) {
        let tempVisuals = this.state.visuals;

        if (this.state.visuals[e.currentTarget.id] === "chevron-down") {
          tempVisuals[e.currentTarget.id] = "chevron-right";
        } else {
          tempVisuals[e.currentTarget.id] = "chevron-down";
        }
    
        this.setState({ visuals: tempVisuals });
    }

    render() {
        var main = (
            <div className="card">
                <div
                id={this.props.cardName + "Card"}
                className="card-link card-header mousePointer"
                data-toggle="collapse"
                href={"#collapse" + this.props.cardName}
                onClick={this.handleClick}
                >
                    <button
                        type="button"
                        className="link-button"
                    >
                    <h4 className="text-muted">
                    
                    {this.props.heading}
        
                    <FA
                        className="faIcon"
                        name={this.state.visuals[this.props.cardName + "Card"]}
                    />
                    </h4>
                </button>
                </div>
                <div id={"collapse" + this.props.cardName} className="collapse show">
                <div className="card-body chartBody">
                    <div id={this.props.cardName + "Chart"} >
                        <Chart cardName={this.props.cardName} graphs={this.props.graphs} xScale={this.props.xScale} yScale={this.props.yScale} zoom={this.props.zoom} xAxis={this.xAxis} yAxis={this.yAxis} />
                    </div>
                </div>
                </div>
            </div>
        )

        return main;
    }
}