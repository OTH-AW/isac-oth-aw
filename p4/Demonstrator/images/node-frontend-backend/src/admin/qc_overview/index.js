import React from 'react'
import {NoBannerLayout} from 'layouts'
import './overviewTP3.css'
import QAItem from './QAItem/QAItem.js';
import RadialBarChart from './radialBarChart/radialBarChart.js';

export default class OverviewTP3 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            colors: {},
            shapes: {},
            faulty: {},
            data: []
        }

        this.backendURL = window.backendURL;
        this.interval = null;
        this._isMounted = false;
    }
    
    componentDidMount() {
        this._isMounted = true;
        this.getData();
        this.interval = setInterval(() => this.getData() , 5000);
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.interval);
    }

    async getData() {
        try {
            let [qc, qcHistory] = await Promise.all([
                fetch(this.backendURL + "/qc").then(response => response.json()),
                fetch(this.backendURL + "/qc/history").then(response => response.json()),
            ]);

            let dataArr = [
                {'Geprüfte WST' : qcHistory.colors.blue + qcHistory.colors.orange},
                {'Blaue WST' : qcHistory.colors.blue},
                {'Orange WST' : qcHistory.colors.orange},
                {'Kreis' : qcHistory.shapes.circle},
                {'Quadrat' : qcHistory.shapes.square},
                {'Dreieck' : qcHistory.shapes.triangle},
                {'Fehlerhafte WST' : qcHistory.faulty}
                ];
            
            if (this._isMounted) {
                this.setState({
                    items: qc,
                    data: dataArr
                });
            }

        }
        catch(err) {
            console.warn(err);
        };
    }

    render() {
       var main = (
            <NoBannerLayout title="Prüfstation - Übersicht">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <RadialBarChart data={this.state.data}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div id="accordion">
                            <div className="card">
                                <div className="card-header p-0 container" id="test">
                                    <div className="row" style={{height: '50px'}}>
                                        <div className="col-2 my-auto">
                                            <h5 className="mb-0 pl-1 float-left">
                                                Status
                                            </h5>
                                        </div>
                                        <div className="col-4 col-sm-4 col-md-2 my-auto">
                                            <h5 className="mb-0">
                                                Form
                                            </h5>
                                        </div>
                                        <div className="col-4 my-auto">             
                                            <h5 className="mb-0 float-left">
                                                ID
                                            </h5>
                                        </div>
                                        <div className="col-2 col-sm-2 col-md-4 my-auto">
                                           
                                        </div>
                                    </div>        
                                </div>
                            </div>
                            {this.state.items.map(item => (
                            <QAItem key={item.workpieceId} item={item} />
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            </NoBannerLayout>
        )
        return main;
    }
}