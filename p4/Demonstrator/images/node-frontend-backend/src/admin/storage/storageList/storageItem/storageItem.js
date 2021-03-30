import React from 'react';
import FA from 'react-fontawesome';
import './storageItem.css'

export default class OrderItem extends React.Component {

  render() {
    var farbe
    var form 
    var process
    var processIcon

    switch(this.props.item.color.actualValue == null ? this.props.item.color.toValue : this.props.item.color.actualValue ) {
        case "Orange":
            farbe = "orange"
            break;
        case "Blau":
            farbe = "blue"
            break;
        default:
            console.log("Keine passende Farbe")
    }

    switch(this.props.item.shape.actualValue == null ? this.props.item.shape.toValue : this.props.item.shape.actualValue ) {
        case "Kreis":
            form = (
                <div className="bg-light activityIconBox">
                    <FA name="circle" className="m-3" size="2x" style={{"color":farbe}}/>
                </div>
            )
            break;
        case "Viereck":
            form = (
                <div className="bg-light activityIconBox">
                    <FA name="square" className="m-3"  size="2x" style={{"color":farbe}}/>
                </div>
            )
            break;
        case "Dreieck":
            form = (
                <div className="bg-light activityIconBox">
                    <FA name="play" className="m-3 fa-rotate-270" size="2x" style={{"color":farbe}}/>
                </div>
            )
            break;
        default:
            form = (
                <div className="bg-light activityIconBox">
                    <FA name="arrow-right" className="m-3 fa-rotate-270" size="2x" style={{"color":farbe}}/>
                </div>
            )


    }

    switch(this.props.item.state.id == null ? this.props.item.state.id : this.props.item.state.id ) {
        case 4: //Auf dem Weg zum Lager nach Prüfung.
            processIcon = (
                <div className="bg-storage1 activityIconBox">
                    <FA name="arrow-right" className="m-3" size="2x"/>
                </div>
            )
            break;
        case 5: //Eingelagert.
            processIcon = (
                <div className="bg-storage2 activityIconBox">
                    <FA name="save" className="m-3" size="2x"/>
                </div>
            )
            break;
        case 6: //Auf dem Weg zur Prüfung, nach Lager.
            processIcon = (
                <div className="bg-storage3 activityIconBox">
                    <FA name="check-square" className="m-3" size="2x"/>
                </div>
            )
            break;
        default:
            processIcon = (
                <div className="bg-storage1 activityIconBox">
                    <FA name="arrow-right" className="m-3" size="2x"/>
                </div>
            )
    } 

    if(this.props.item.state.hasOwnProperty('message')){
        process = this.props.item.state.message
    } else {
        process = "Keine Status eingetragen"
    }

    var main = (
        <li className="list-group-item d-flex justify-content-between align-items-center mb-2 p-0">
            {form}
            <span className="ml-2 activityFontSize">{process}</span>
            {processIcon}
        </li>
    )
 return main
  }
} 