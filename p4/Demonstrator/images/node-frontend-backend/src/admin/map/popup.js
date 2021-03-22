import React from 'react';
import { Popup } from 'react-leaflet';
import './map-style.css';
import Details from './details.js';
import SelectedDetail from './selectedDetail.js'

export default class CustomPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clickedDetails: null,
            clickedId: null,
            focusId: false,
        }

        this.handleDetails = this.handleDetails.bind(this);
    }

    handleDetails(e) {
        switch(e.target.attributes.id.value) {
            case 'OT':
                this.setState({clickedDetails: this.props.products.Dreieck.Orange, clickedId: 'OT'});
                break;
            case 'OS':
                this.setState({clickedDetails: this.props.products.Viereck.Orange, clickedId: 'OS'});
                break;
            case 'OC':
                this.setState({clickedDetails: this.props.products.Kreis.Orange, clickedId: 'OC'});
                break;
            case 'BT':
                this.setState({clickedDetails: this.props.products.Dreieck.Blau, clickedId: 'BT'});
                break;
            case 'BS':
                this.setState({clickedDetails: this.props.products.Viereck.Blau, clickedId: 'BS'});
                break;
            case 'BC':
                this.setState({clickedDetails: this.props.products.Kreis.Blau, clickedId: 'BC'});
                break;
            default:
                console.log('FEHLER')
            }
    }

    render() {
        let triangles = this.props.products.Dreieck;
        let squares = this.props.products.Viereck;
        let circles = this.props.products.Kreis;

        let productOrder = 0;
        let selectedProduct =  null;
        try{
            Object.values(this.props.products).forEach(shape => {
                Object.values(shape).forEach(color => {
                    for(let product of color) {
                        if(product.order) {
                            productOrder = productOrder + 1;
                        }
                        if(product.selected) {
                            selectedProduct = product;
                        }
                    }
                })
            })
        }
        catch(e) {
            console.log(e)
        }
        
        var main = null;
        // Prüft, ob vom Backend schon Daten durchgegeben wurden
        if (Object.entries(this.props.products).length === 0) {
            return (
                <Popup>
                    Bitte aktualisieren sie die Daten um den aktuellen Standort der Werkstücke zu sehen.
                </Popup>
            )
        }
        else if (this.props.markup) {
            return (
                <Popup>
                    <SelectedDetail product={selectedProduct} handleButton={this.handleSwitchButton} />
                </Popup>
            )
        }
        else {
            main = (
                <Popup>
                    <div>
                        <div className="row">
                            <h3>
                                Übersicht
                            </h3>
                        </div>
                        <div className="row">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th style={{textAlign: "center"}}>
                                            <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" className="bi bi-triangle-fill" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/>
                                            </svg>
                                        </th>
                                        <th style={{textAlign: "center"}}>
                                            <svg className="bi bi-square-fill" width="1.2em" height="1.2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="16" height="16" rx="2" />
                                            </svg>
                                        </th>
                                        <th style={{textAlign: "center"}}>
                                            <svg className="bi bi-circle-fill" width="1.2em" height="1.2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="8" cy="8" r="8" />
                                            </svg>
                                        </th>
                                        <td style={{background: "#DDD", textAlign: "center"}}>
                                            &sum;&rArr;
                                        </td>
                                    </tr>
                                    <tr style={{background: 'orange'}}>
                                        <td onClick={this.handleDetails} id="OT" className="clickableTableCell">
                                            {triangles.Orange.length}
                                        </td>
                                        <td onClick={this.handleDetails} id="OS" className="clickableTableCell">
                                            {squares.Orange.length}
                                        </td>
                                        <td onClick={this.handleDetails} id="OC" className="clickableTableCell">
                                            {circles.Orange.length}
                                        </td>
                                        <td style={{background: "#DDD", textAlign: "center"}}>
                                            {(triangles.Orange.length + squares.Orange.length + circles.Orange.length)}
                                        </td>
                                    </tr>
                                    <tr style={{background: '#31A4DE'}}>
                                        <td onClick={this.handleDetails} id="BT" className="clickableTableCell">
                                            {triangles.Blau.length}
                                        </td>
                                        <td onClick={this.handleDetails} id="BS" className="clickableTableCell">
                                            {squares.Blau.length}
                                        </td>
                                        <td onClick={this.handleDetails} id="BC" className="clickableTableCell">
                                            {circles.Blau.length}
                                        </td>
                                        <td style={{background: "#DDD", textAlign: "center"}}>
                                            {(triangles.Blau.length + squares.Blau.length + circles.Blau.length)}
                                        </td>
                                    </tr>
                                    <tr style={{background: "#EEE"}}>
                                        <td style={{textAlign: "center"}}>
                                            {(triangles.Blau.length + triangles.Orange.length)}
                                        </td>
                                        <td style={{textAlign: "center"}}>
                                            {(squares.Blau.length + squares.Orange.length)}
                                        </td>
                                        <td style={{textAlign: "center"}}>
                                            {(circles.Blau.length + circles.Orange.length)}
                                        </td>
                                        <td style={{textAlign: "center"}}>
                                            &sum;&dArr;
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                            { `Werkstücke: ${circles.Blau.length + circles.Orange.length + triangles.Blau.length + triangles.Orange.length + squares.Blau.length + squares.Orange.length} von ${this.props.wstCount}`}
                            <br/>
                            { `Mit Bestellungen: ${productOrder} von ${this.props.orderCount}`}

                        </div>
                        {this.state.clickedDetails ? <Details wst={this.state.clickedDetails} /> : null}
                    </div>
                </Popup>
            )
        }

        return main;
    }
}