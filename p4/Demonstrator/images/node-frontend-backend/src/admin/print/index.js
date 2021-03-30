import React from 'react'
import {NoBannerLayout} from 'layouts'
import Printer from './printer/printer.js'
import PrintList from './printList/printList.js'  

export default class Print extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items:{},
            workpiece:{}
        }

        this.backendURL = window.backendURL;
        this.interval = null;
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getData();
        this.interval = setInterval(() => this.getData() , 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.interval);
    }

    async getData() {
        try {
            let [printer, workpieces] = await Promise.all([
                fetch(this.backendURL + "/print/printers").then(response => response.json()),
                fetch(this.backendURL + "/workpiece").then(response => response.json()),
            ]);
            if (this._isMounted) {
                this.setState({
                    workpiece: workpieces,
                    items: printer
                });
            }
        }
        catch(err) {
            console.warn(err);
        };
    }

    render() {
        var orangePrinter
        var bluePrinter
        
        var main = (<NoBannerLayout title="Drucker"/>)
        if (Object.keys(this.state.items).length !== 0){
            // Druckerdaten erhalten
            if (this.state.items[0].base_information.color === "Orange"){
                orangePrinter = this.state.items[0]
                bluePrinter = this.state.items[1]
            } else {
                orangePrinter = this.state.items[1]
                bluePrinter = this.state.items[0]
            }

            main = (
                <NoBannerLayout title="Drucker">
                    <div className="col-md-12 order-md-1 mx-1">
                        <div className="row">
                            <div className="col-12 col-md-4 text-center">
                                Drucker-Warteschlange
                                <PrintList items={this.state.workpiece}/>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="row mb-3">
                                    <div className="col-12">
                                    <div className="invisible">...</div>
                                    <Printer items={orangePrinter}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="row mb-3">
                                    <div className="col-12">
                                    <div className="invisible">...</div>
                                    <Printer items={bluePrinter}/>
                                    </div>
                                </div>
                            </div>
                        </div>               
                    </div>
                </NoBannerLayout>
            )
        } else {
            // Noch keine Druckerdaten erhalten
            main = (
                <NoBannerLayout title="Drucker">
                    <div className="col-md-12 order-md-1 mx-1 text-center">
                        <div className="spinner-border ml-auto text-primary" style={{marginTop: "0px"}} role="status" aria-hidden="true"></div>
                        <span className="ml-2" style={{display: "inline-block", height: "100%", verticalAlign: "middle"}}>Verbindung zu Druckern wird hergestellt ...</span>
                    </div>
                </NoBannerLayout>
            )
        }
        return main;
    }
}