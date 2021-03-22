import React from 'react';
import FA from 'react-fontawesome';
import { Link } from "react-router-dom";
  
export default class WorkpieceItem extends React.Component {

  render() {
    var color
    var form 
    var order
    var date

    switch(this.props.item.color.actualValue == null ? this.props.item.color.toValue : this.props.item.color.actualValue ) {
        case "Orange":
            color = "orange"
            break;
        case "Blau":
            color = "blue"
            break;
        default:
            color = "blue"
    }

    switch(this.props.item.shape.actualValue == null ? this.props.item.shape.toValue : this.props.item.shape.actualValue ) {
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
    
    if(this.props.item.hasOwnProperty('order')){
        order = <FA name="shopping-cart" size="2x"/>
    } else {
        order = <FA name="shopping-cart" size="2x" className="text-muted"/>
    }

    date = this.props.item.createdAt
    date = new Date(date).toLocaleString();

    var linkDetails = "/admin/workpieces/" + this.props.item._id
    var linkMap = "/admin/map?id=" + this.props.item._id
    var linkEdit = "/admin/webnfc/" + this.props.item._id

    var main = (
        <li className="list-group-item d-flex align-items-center mb-2">
            <div className="container">
                <div className="row">
                    <div className="col-2 col-sm-1 my-auto">
                        {form}
                    </div> 
                    <div className="col-5 col-sm-4 col-md-3 col-lg-2 my-auto"> 
                        <span>{this.props.item.state.message}</span>
                    </div>
                    <div className="col-sm-2 col-md-1 my-auto d-none d-sm-block">
                        {order}
                    </div>
                    <div className="col-3 my-auto d-none d-md-block">
                        <span>{this.props.item.workpieceId}</span>
                    </div>
                    <div className="col-2 my-auto d-none d-lg-block">
                        <span>{date}</span>
                    </div>
                    <div className="col-sm-1 my-auto d-none d-sm-block">
                        <Link to={linkMap}><FA name="map" size="2x"/></Link>
                    </div>
                    <div className="col-3 col-sm-3 col-md-2 col-lg-1 my-auto">
                        <Link to={linkEdit}><FA name="tag" size="2x"/></Link>
                    </div>
                    <div className="col-2 col-sm-1 my-auto">
                        <Link to={linkDetails} className="nav-link float-right mr-2 p-0" ><FA name="search" size="2x"/></Link>
                    </div>
                </div>
            </div>
        </li>
    )
        
    return(main)
  }
} 