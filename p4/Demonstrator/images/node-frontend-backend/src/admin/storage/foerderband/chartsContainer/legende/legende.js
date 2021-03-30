import React from 'react';
import "font-awesome/css/font-awesome.css";
import FA from "react-fontawesome";
import LegendColumn from './legendElements/legendColumn.js'



export default class Legend extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visuals: 'chevron-down'
        };

        this.visualHandle = this.visualHandle.bind(this);
    }

    visualHandle() {
        if (this.state.visuals === "chevron-down") {
          this.setState({ visuals: "chevron-right" });
        } else {
          this.setState({ visuals: "chevron-down" });
        }
      }    

    render() {
        var main = (
            <div className="card legendCard">
                <div
                    id="control"
                    className="card-header legendCardHeader card-link mousePointer"
                    data-toggle="collapse"
                    href="#collapseLegend"
                    onClick={this.visualHandle}
                >
                    <button
                        type="button"
                        className="link-button"
                    >
                        <h4 className="text-center text-muted">
                            Legende
                            <FA className="faIcon" name={this.state.visuals} />
                        </h4>
                    </button>
                </div>
                <div id="collapseLegend" className="collapse show">
                    <div className="card-body">
                        <div className="row justify-content-center">
                              {
                                this.props.information.notification.map((graph, i) => 
                                    <LegendColumn name={graph.name} color={graph.wst} style={graph.strokeIndex} key={i}></LegendColumn>
                                )
                              }
                        </div>
                        <div className="row justify-content-center">
                              {
                                this.props.information.commands.map((graph, i) => 
                                    <LegendColumn name={graph.name} color={graph.wst} style={graph.strokeIndex} key={i}></LegendColumn>
                                )                            
                              }
                        </div>
                        <div className="row justify-content-center">
                              {
                                this.props.information.power.map((graph, i) => 
                                    <LegendColumn name={graph.name} color={graph.wst} style={graph.strokeIndex} key={i}></LegendColumn>
                                )                              
                              }
                        </div>
                    </div>
                </div>
            </div>
        )

        return main;
    }
}