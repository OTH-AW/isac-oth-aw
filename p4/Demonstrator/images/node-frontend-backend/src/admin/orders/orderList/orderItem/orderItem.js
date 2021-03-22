import React from 'react';
import FA from 'react-fontawesome';
import {Link} from "react-router-dom";
  
export default class OrderItem extends React.Component {

  render() {
    var color
    var form 
    var process
    var faculty

    switch(this.props.item.order.color.actualValue == null ? this.props.item.order.color.toValue : this.props.item.order.color.actualValue ) {
        case "Orange":
            color = "orange"
            break;
        case "Blau":
            color = "blue"
            break;
        default:
            color = "grey"
    }

    switch(this.props.item.order.shape.actualValue == null ? this.props.item.order.shape.toValue : this.props.item.order.shape.actualValue ) {
        case "Kreis":
            form = (
                <div>
                    <FA name="circle" size="3x" style={{"color":color}}/>
                </div>
            )
            break;
        case "Viereck":
            form = (
                <div>
                    <FA name="square"  size="3x" style={{"color":color}}/>
                </div>
            )
            break;
        case "Dreieck":
            form = (
                <div>
                    <FA name="play" className="fa-rotate-270" size="3x" style={{"color":color}}/>
                </div>
            )
            break;
        default:
            form = (
                <div>
                    <FA name="question-circle" size="3x" style={{"color":color}}/>
                </div>
            )


    }

    if(this.props.item.state.hasOwnProperty('message')){
        process = this.props.item.state.message
    } else {
        process = "Angelegt, in Produktions-Warteschlange."
    }

    if(this.props.item.state.hasOwnProperty('place')){
        if (this.props.item.state.place.faculty !== null){
            faculty = this.props.item.state.place.faculty
        }
        else {
            faculty = "Kein Standort eingetragen"
        }
    } else {
        faculty = "Kein Standort eingetragen"
    }

    var linkDetails = "/admin/workpieces/" + this.props.item._id
    var linkMap = "/admin/map?id=" + this.props.item._id

    var main = (
        <li className="list-group-item d-flex align-items-center mb-2">
            <div className="container">
                <div className="row">
                    <div className="col-2 col-md-1 col-lg-1 my-auto">
                        {form}
                    </div> 
                    <div className="col-5 col-md-3 col-lg-3 my-auto"> 
                        <span>{process}</span>
                    </div>
                    <div className="col-3 col-md-4 col-lg-3 my-auto d-lg-flex align-items-center d-none d-md-block">                      
                        <FA name="user" size="2x"/>
                        <span className="ml-2 text-left">
                            {this.props.item.order.customer.name}<br/>
                            {this.props.item.order.customer.firstname}<br/>
                            {this.props.item.order.customer.email}
                        </span>                 
                    </div>
                    <div className="col-lg-3 my-auto d-lg-flex align-items-center d-none d-lg-block">
                        <FA name="map-marker" size="2x"/> 
                        <span className="ml-2 text-left">{faculty}</span>    
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 my-auto">
                        <Link to={linkMap}><FA name="map" size="2x"/></Link>
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 my-auto">
                        <Link to={linkDetails} className="nav-link float-right mr-2 p-0" ><FA name="search" size="2x"/></Link>
                    </div>
                </div>
            </div>
        </li>
    )
    
 return main
  }
} 