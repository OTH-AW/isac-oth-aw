import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Webnfc from './admin/webnfc/index.js';
import StatusOhneID from './status/status.js';
import StatusMitID from './status/statusWithID.js';
import WorkpieceDetails from './admin/workpieces/details.js'
import OrderDetails from './admin/workpieces/details.js'
import Landingpage from './bestellung/landingpage.js';

import Dashboard from './admin/dashboard.js';

import Controlpis from './admin/debug/controlpis.js';

import Print from './admin/print/index.js';
import PrintProduction from './admin/print/printproduction.js';
import PrintCam from './admin/print/cam.js';
import Workpieces from './admin/workpieces/index.js';
import Orders from './admin/orders/index.js';
import Map from './admin/map/index.js';
import Storage from './admin/storage/index.js';
import StorageCam from './admin/storage/cam.js';
import PruefungCam from './admin/quality_control/cam.js';
import CamOverview from './admin/cams/index.js';
import AbholstationCam from './admin/pick_up/cam.js';
import Bestellung from './bestellung/bestellung.js';
import WebGL from './webGL/webGL.js';
import * as serviceWorker from './serviceWorker';
import "leaflet/dist/leaflet.css";
import 'font-awesome/css/font-awesome.css';
import FA from 'react-fontawesome';
import Foerderband from 'admin/storage/foerderband/foerderband.js';
import QCOverview from 'admin/qc_overview/index.js';

window.backendURL = "http://" + window.location.hostname + ":5000";
//window.backendURL = "http://3f6846eb115a.ngrok.io"; //Für ngrok

class App extends React.Component {
  constructor(props) {
    super(props);

    this.currentYear = new Date().getFullYear();

    this.state = {
      activeLink: <Bestellung />
    }

  }

  render() {
    var main = (
      <React.StrictMode>
        <div id="main-header" className="bg-isac-primary">
            <div className="container">
                <div className="row ">
                    <div className="col-md-6 col-sm-12 text-center text-md-left">
                        <div className="logo">
                            <a href="/" title="ISAC@OTH-AW" rel="home"> ISAC@OTH-AW </a>
                            <p className="text-white">Industry Software Application Center</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12 ">
                        <ul className="head-contact-info d-none d-md-block text-md-right">
                            <li><a href="mailto:isac-kontakt@oth-aw.de"><i className="fa fa-envelope"></i>isac-kontakt@oth-aw.de</a></li>
                        </ul>
                        <ul className="social-links text-center text-md-right">
                            <li><a href="https://twitter.com/ISAC_OTH_AW"><FA name="twitter-square" size="2x"/></a></li>
                            <li><a href="https://www.xing.com/communities/groups/isac-um-oth-aw-3d60-1090379"><FA name="xing-square" size="2x"/></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Router>
          <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
              <a className="navbar-brand" href="/">Small Smart Factory</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                  <ul className="navbar-nav ml-auto">
                      <li className="nav-item text-md-right">
                          <Link to="/" className="nav-link">Bestellung</Link>
                      </li>
                      <li className="nav-item text-md-right">
                        <Link to="/status" className="nav-link">Status</Link>
                      </li>
                      <li className="nav-item text-md-right">
                        <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                      </li>
                  </ul>
              </div>
          </nav>   
     
      
            {/* Hier stehen die Möglichkeiten an Seiten, die die App darstellen soll. 
            Jede <Route> kann über einen <Link> Tag (siehe oben) angesprochen werden und wird dann dementsprechend geladen.
            Der Switch sowie die Link Tags müssen innerhalb des Router Parent liegen. 
            An der Position des Switches wird dann die entsprechende "Seite" geladen*/}
            <Switch>
            <Route exact path="/bestellung/:id" component={Landingpage}/>
              <Route exact path="/admin/orders/:id" component={OrderDetails}/>
              <Route exact path="/admin/workpieces/:id" component={WorkpieceDetails}/>
              <Route exact path="/status/:id" component={StatusMitID}/>
              <Route exact path="/admin/webnfc/:id" component={Webnfc}/>
              <Route exact path="/admin/webnfc" component={Webnfc}/>
              <Route exact path="/status">
                <StatusOhneID />
              </Route>
              
              <Route exact path="/">
                <Bestellung />
              </Route>
              <Route exact path="/webgl_unity_tp1">
                <WebGL directory="webgl_data_tp1" 
                  project="WebGL.json"
                  banner="Druck • 3D-Ansicht" 
                  title="Druckübersicht"
                  showInteractiveHint="false"
                  tpId="tp1" />
              </Route>
              <Route exact path="/webgl_unity_tp2">
                <WebGL directory="webgl_data_tp2" 
                  project="TP2.json"
                  banner="Lager • 3D-Ansicht" 
                  title="Lagerübersicht"
                  showInteractiveHint="true"
                  tpId="tp2" />
              </Route>
              <Route exact path="/webgl_unity_tp3">
                <WebGL directory="webgl_data_tp3" 
                  project="TP3_Print.json"
                  banner="Prüfstation • 3D-Ansicht" 
                  title="Prüfstation"
                  showInteractiveHint="true"
                  tpId="tp3" />
              </Route>
              <Route exact path="/admin/dashboard">
                <Dashboard />
              </Route>
              <Route exact path="/admin/debug">
                <Controlpis />
              </Route>
              <Route exact path="/admin/print">
                <Print />
              </Route>
              <Route exact path="/admin/print/production">
                <PrintProduction />
              </Route>
                <Route exact path="/admin/print/cam">
                  <PrintCam />
                </Route>
              <Route exact path="/admin/workpieces">
                <Workpieces />
              </Route>
              <Route exact path="/admin/orders">
                <Orders />
              </Route>
              <Route exact path="/admin/map">
                {/* <Map singlePick="5ee72ea213237f05339c78d0" /> */}
                <Map />
              </Route>
              <Route exact path="/admin/storage">
                <Storage />
                <div className="container">
                  <div className="row">
                      <div className="col-12 mt-3 mb-5 text-center">
                          <h1 className="p-3 border border-isac-secondary secondary-isac-bottom-shadow">
                              Protokoll
                          </h1>
                      </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <h5>Was is das Protokoll?</h5>
                      <p>
                        Das Protokoll ist eine spezielle Ansicht des Lagers, indem man sämlichte Sensor- und Leistungsdaten und Werstückträger-Bewegungen innerhalb des Lagers
                        durch die Darstellung in Charts nachvollziehen kann. 
                      </p>
                      <Link to="/admin/storage/history">
                        <button type="button" className="btn btn-outline-primary" style={{ whiteSpace: "nowrap" }}>
                          <FA name="file-text" style={{marginRight: "1%"}}></FA> 
                          Hier gehts zum Protokoll
                        </button>
                      </Link>
                      
                    </div>
                    <div className="col">
                      <h5>Wie benutzte ich das Protokoll?</h5>
                      <p>
                        Auf der Karte kann man Ebenen ein und ausblenden und Verschiedene Sensoren und Leistungsmessgeräte anwählen.
                        Mit dem sich darunter befindlichen Control Panel kann man nun eine Vorauswahl für die gewünschten Werstückträger treffen.<br />
                        Innerhalb der Charts ist es möglich per Mausrad zu Zoomen und mit gedrückten Linksklick und Ziehen die Graphen zu bewegen.
                        Diese Aktionen werden über alle Charts synchronisiert.
                        Die Daten werden bei jeder Interaktion live aktualisiert. 
                      </p>
                    </div>
                  </div>
                  
                </div>
              </Route>
              <Route exact path="/admin/storage/history">
                <Foerderband />
              </Route>
              <Route exact path="/admin/storage/cam">
                <StorageCam />
              </Route>
              <Route exact path="/admin/quality-control/cam">
                <PruefungCam />
              </Route>
              <Route exact path="/admin/cams">
                <CamOverview />
              </Route>
              <Route exact path="/admin/pick-up/cam">
                <AbholstationCam />
              </Route>
              <Route exact path="/admin/quality-control/overview">
                <QCOverview />
              </Route>
              
            </Switch>
      
          <footer className="p-5 text-muted text-center text-small">
              <p className="mb-1">&copy; {this.currentYear} ISAC@OTH-AW</p>
              <ul className="list-inline">
                  <li className="list-inline-item"><a href="/" className="isac-primary">Impressum</a></li>
                  <li className="list-inline-item"><a href="/" className="isac-primary">Datenschutz</a></li>
              </ul>
          </footer>
        </Router>

      </React.StrictMode>
    )

    return main;
    
  }
}



ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
