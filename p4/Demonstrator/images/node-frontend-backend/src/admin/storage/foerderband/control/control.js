import React from "react";
import "font-awesome/css/font-awesome.css";
import FA from "react-fontawesome";
import WstControl from "./WstControl/WstControl.js";

export default class Control extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: "all",
      visuals: { controlArrow: "chevron-down" },
    };

    this.visualHandle = this.visualHandle.bind(this);
  }

  // Setzt State bei User Interaktion und updated parent über prop-Funktion
  handleClick = (e) => {
    switch (e.target.innerHTML) {
      case "Alle":
        this.setState({ view: "all"});
        // Setzt WST zurück und erzwingt dadurch ein neues Rendern der Charts
        this.props.update([]);
        break;
      case "Einzelauswahl":
        this.setState({ view: "single" });
        this.props.update([1]);
        break;
      case "Mehrfachauswahl":
        this.setState({ view: "multiple" });
        this.props.update([1]);
        break;

      default:
        console.log("FEHLER: WST-Sicht");
        break;
    }
  };

  // Regelt die visuelle Anzeige für die Bootrstrap Card
  visualHandle() {
    if (this.state.visuals.controlArrow === "chevron-down") {
      this.setState({ visuals: { controlArrow: "chevron-right" } });
    } else {
      this.setState({ visuals: { controlArrow: "chevron-down" } });
    }
  }

  render() {
    var viewControl = (
      <div
        className="btn-group mr-2"
        role="group"
        onClick={this.handleClick}
      >
        <button type="button" className="btn btn-secondary" >
          Alle
        </button>
        <button type="button" className="btn btn-secondary">
          Einzelauswahl
        </button>
        <button type="button" className="btn btn-secondary">
          Mehrfachauswahl
        </button>
      </div>
    )
    if(this.props.loadingFlag) {
      viewControl = (
        <div
          className="btn-group mr-2"
          role="group"
          onClick={this.handleClick}
        >
          <button type="button" className="btn btn-secondary" disabled>
            Alle
          </button>
          <button type="button" className="btn btn-secondary" disabled>
            Einzelauswahl
          </button>
          <button type="button" className="btn btn-secondary" disabled>
            Mehrfachauswahl
          </button>
        </div>
      )
      
    }
    var main = (
        <div className="card wstCard">
          <div
            id="control"
            className="card-header wstCardHeader card-link mousePointer "
            data-toggle="collapse"
            href="#controlBody"
            onClick={this.visualHandle}
          >
              <button
                  type="button"
                  className="link-button"
              >
                <h4 className="text-center text-muted">
                  Werkstückträger
                  <FA className="faIcon" name={this.state.visuals.controlArrow} />
                </h4>
            </button>
          </div>
          <div id="controlBody" className="collapse show">
            <div className="card-body">
              <div className="row justify-content-center">
                <div
                  className="btn-toolbar"
                  role="toolbar"
                  aria-label="Toolbar with button groups"
                >
                  {viewControl}
                </div>
              </div>
              <WstControl view={this.state.view} updateParent={this.props.update} loadingFlag={this.props.loadingFlag}/>
            </div>
          </div>
        </div>
    );
    return main;
  }
}
