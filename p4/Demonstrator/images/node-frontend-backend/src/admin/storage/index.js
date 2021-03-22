import React from 'react'
import {NoBannerLayout} from 'layouts'
import StorageList from './storageList/storageList.js'
import BarChart from './barChart/barChart.js'  

export default class Storage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dreieckData: [0, 0],
            kreisData: [0, 0],
            viereckData: [0, 0],
            height: 300,
            items:[]
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
            let [storage] = await Promise.all([
                fetch(this.backendURL + "/workpiece/storage").then(response => response.json())
            ]);
            
            let dreieckBlau = 0
            let dreieckOrange = 0

            let kreisBlau = 0
            let kreisOrange = 0

            let viereckBlau = 0
            let viereckOrange = 0
           
            for (let item in storage){
                if(storage[item].shape.actualValue === "Dreieck" && storage[item].state.id === 5){
                    if(storage[item].color.actualValue === "Blau"){
                        ++dreieckBlau
                    }else{
                        ++dreieckOrange
                    }
                } 
                else if(storage[item].shape.actualValue === "Kreis" && storage[item].state.id === 5){
                    if(storage[item].color.actualValue === "Blau"){
                        ++kreisBlau
                    }else{
                        ++kreisOrange
                    }
                }
                else if(storage[item].shape.actualValue === "Viereck" && storage[item].state.id === 5){
                    if(storage[item].color.actualValue === "Blau"){
                        ++viereckBlau
                    }else{
                        ++viereckOrange
                    }
                }
            }
            
            if (this._isMounted) {
                this.setState({
                    items: storage,
                    dreieckData: [dreieckOrange, dreieckBlau],
                    kreisData: [kreisOrange, kreisBlau],
                    viereckData: [viereckOrange, viereckBlau]
                });
            }

        }
        catch(err) {
            console.warn(err);
        };
    }

    render() {
        var main = (
            <NoBannerLayout title="Lager">
                <div className="col-md-12 order-md-1 mx-1">
                    <div className="row">
                        <div className="col-md-4">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Übersicht</span>
                            </h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            Lager-Aktivität
                            <StorageList items={this.state.items}/>
                        </div>
                        <div className="col-md-4">
                            <div className="row mb-3">
                                <div className="col-12">
                                Dreieck
                                <BarChart data={this.state.dreieckData} height={this.state.height} />
                                </div>
                            </div>
                    
                            <div className="row mb-3">
                                <div className="col-12">
                                Kreis
                                <BarChart data={this.state.kreisData} height={this.state.height} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="row mb-3">
                                <div className="col-12">
                                Viereck
                                <BarChart data={this.state.viereckData} height={this.state.height} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </NoBannerLayout>
        )

        return main;
    }
}