import React from 'react';
import Map from './map/map.js';
import Control from './control/control.js';
import ChartContainer from './chartsContainer/chartsContainer.js';
import './foerderband.css';

export default class Foerderband extends React.Component {
  constructor(props) {
    super(props);

    this.state =  {
      wst: [],
      activeSensors: [],
      loadingFlag: false
    };

    this.updateCount = 0;

    this.handleMapUpdate = this.handleMapUpdate.bind(this);
    this.handleControlUpdate = this.handleControlUpdate.bind(this);
    this.handleDataLoading = this.handleDataLoading.bind(this);
  }

  // Übergabefunktion für Child, ändert mit Auslöser auf der Map den State für die Aktiven Sensoren
  handleMapUpdate(sensors) {
    this.setState({
      activeSensors: sensors,
      loadingFlag: true
    })
  }

  // Übergabefunktion für Child, um State des Parents ändern zu können 
  handleControlUpdate(newWst) {
    this.setState({
      wst: newWst,
      loadingFlag: true
    })
  }
  // Übergabefunktion für Child, um LoadingState auf false zu setzen
  handleDataLoading() {
    this.setState({loadingFlag: false})
  }

  /* 
    Rendert die Förderbandseite, Wobei Nur grobe strukur auf oberster Ebene gerendert wird, 
    alles andere wird in kleinere Komponenten aufgespalten und die wichtigen Informationen an parent (hierher) weitergegeben/ referiert 
  */
  render() {
    console.log(this.state.loadingFlag)
    var main = (
      <div className="container"> 
        <div className="row">
            <div className="col-12 mt-3 mb-5 text-center">
                <h1 className="p-3 border border-isac-secondary secondary-isac-bottom-shadow">
                    Förderband
                </h1>
            </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Map update={this.handleMapUpdate} loadingFlag={this.state.loadingFlag} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Control update={this.handleControlUpdate} loadingFlag={this.state.loadingFlag} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <ChartContainer wst={this.state.wst} sensors={this.state.activeSensors} handleDataLoading={this.handleDataLoading} flag={this.state.loadingFlag}/>
          </div>
        </div>


      </div>

    )
        
    return(main)
  }
} 