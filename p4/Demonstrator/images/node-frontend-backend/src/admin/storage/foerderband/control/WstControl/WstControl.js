import React from "react";
import Checkable from './FormElements/checkables.js'

export default class WstControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      radio: 1,
      checkbox: [1]
    };

    this.handleRadio = this.handleRadio.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  // gibt ausgewählten Wst an Parent weiter und speichert die Daten lokal, um richtig darstellen zu können
  handleRadio(e) {
    this.setState({radio: e.target.value})
    this.props.updateParent([e.target.value]);
  }

  // gibt ausgewählte Checkboxen an Parent und speichert die Daten Lokal, um richtig Darstellen nzu können
  handleCheckbox(e) {
    if(e.target.checked === true) {
      // der interne State ist nur für die Darstellung zuständig, die Funktion "updateParent" enthält die Funktionalität
      this.props.updateParent(this.state.checkbox.concat(parseInt(e.target.value)));
      this.setState({checkbox: this.state.checkbox.concat(parseInt(e.target.value))})
    }
    else {
      this.props.updateParent(this.state.checkbox.filter(element => element !== e.target.value));
      this.setState({checkbox: this.state.checkbox.filter(element => element !== e.target.value)})
    }
  }

  // wenn die Komponente ein Update erhalten hat, kann es sein, dass im Parent die View geändert wurde, dies wird hier angepasst
  componentDidUpdate() {
    switch(this.props.views) {
      case "single":
        this.props.updateParent([this.state.radio]);
        break;
      case "multiple":
        this.props.updateParent(this.state.checkbox);
        break;
      default:
        break;
    }
  }

  render() {
    var main = null;
    switch (this.props.view) {
      case "all":
        main = <div className="row mt-4">{/* Platzhalter */}</div>;
        break;

      case "single":
        main = (
          <form id="radioWST">
            <div className="row mt-3">
                  <Checkable type="radio" id={"wst1"} value={1} name="radioGroup" label="Werkstückträger 1" handler={this.handleRadio} checked={this.state.radio===1}  disabling={this.props.loadingFlag} />
                  <Checkable type="radio" id={"wst2"} value={2} name="radioGroup" label="Werkstückträger 2" handler={this.handleRadio} checked={this.state.radio===2} disabling={this.props.loadingFlag} />
                  <Checkable type="radio" id={"wst3"} value={3} name="radioGroup" label="Werkstückträger 3" handler={this.handleRadio} checked={this.state.radio===3} disabling={this.props.loadingFlag} />
                  <Checkable type="radio" id={"wst4"} value={4} name="radioGroup" label="Werkstückträger 4" handler={this.handleRadio} checked={this.state.radio===4} disabling={this.props.loadingFlag} />
                  <Checkable type="radio" id={"wst5"} value={5} name="radioGroup" label="Werkstückträger 5" handler={this.handleRadio} checked={this.state.radio===5} disabling={this.props.loadingFlag} />
                  <Checkable type="radio" id={"wst6"} value={6} name="radioGroup" label="Werkstückträger 6" handler={this.handleRadio} checked={this.state.radio===6} disabling={this.props.loadingFlag} />
            </div>
          </form>
        );
        break;

      case "multiple":
        main = (
          <form id="checkBoxWST">
            <div className="row mt-4">
                <Checkable type="checkbox" id={"wst1"} value={1} name="checkboxGroup" label="Werkstückträger 1" handler={this.handleCheckbox} checked={this.state.checkbox.includes(1)}  disabling={this.props.loadingFlag} />
                <Checkable type="checkbox" id={"wst2"} value={2} name="checkboxGroup" label="Werkstückträger 2" handler={this.handleCheckbox} checked={this.state.checkbox.includes(2)} disabling={this.props.loadingFlag} />
                <Checkable type="checkbox" id={"wst3"} value={3} name="checkboxGroup" label="Werkstückträger 3" handler={this.handleCheckbox} checked={this.state.checkbox.includes(3)} disabling={this.props.loadingFlag} />
                <Checkable type="checkbox" id={"wst4"} value={4} name="checkboxGroup" label="Werkstückträger 4" handler={this.handleCheckbox} checked={this.state.checkbox.includes(4)} disabling={this.props.loadingFlag} />
                <Checkable type="checkbox" id={"wst5"} value={5} name="checkboxGroup" label="Werkstückträger 5" handler={this.handleCheckbox} checked={this.state.checkbox.includes(5)} disabling={this.props.loadingFlag} />
                <Checkable type="checkbox" id={"wst6"} value={6} name="checkboxGroup" label="Werkstückträger 6" handler={this.handleCheckbox} checked={this.state.checkbox.includes(6)} disabling={this.props.loadingFlag} />
            </div>
          </form>
        );
        break;

      default:
        break;
    }

    return main;
  }
}
