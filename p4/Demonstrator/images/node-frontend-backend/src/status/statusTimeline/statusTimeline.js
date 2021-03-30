import React from 'react';
import './statusTimeline.css'
import StatusNode from './statusNode/statusNode.js';
import {Link} from "react-router-dom";

const triangles = {
    Orange:   "img/shapes/triangle/orange-triangle.png", 
    Blau:   "img/shapes/triangle/blue-triangle.png"
};
const circles = {
    Orange:   "img/shapes/circle/orange-circle.png", 
    Blau:   "img/shapes/circle/blue-circle.png"
};
const squares = {
    Orange:   "img/shapes/square/orange-square.png", 
    Blau:   "img/shapes/square/blue-square.png"
};

export default class statusTimeline extends React.Component {

  render() {
    if ("shape" in this.props.items){
        switch(this.props.items.shape.toValue) {
            case 'Dreieck': 
                this.preview = <div className="circular--landscape"><img src={triangles[this.props.items.color.toValue]} alt="dreieck"/></div>
                break;
            case 'Viereck':                
                this.preview = <div className="circular--landscape"><img src={squares[this.props.items.color.toValue]} alt="viereck"/></div>
                break;
            case 'Kreis':
                this.preview = <div className="circular--landscape"><img src={circles[this.props.items.color.toValue]} alt="kreis"/></div>
                break;
            default:
                console.log('FEHLER: Shape ändern');
        }
    }else{
        switch(this.props.items.order.shape.toValue) {
            case 'Dreieck': 
                this.preview = <div className="circular--landscape"><img src={triangles[this.props.items.order.color.toValue]} alt="dreieck"/></div>
                break;
            case 'Viereck':                
                this.preview = <div className="circular--landscape"><img src={squares[this.props.items.order.color.toValue]} alt="viereck"/></div>
                break;
            case 'Kreis':
                this.preview = <div className="circular--landscape"><img src={circles[this.props.items.order.color.toValue]} alt="kreis"/></div>
                break;
            default:
                console.log('FEHLER: Shape ändern');
        }
    }


    this.test = new Map();

    //ORDER
    if ("order" in this.props.items){
        this.test.set(this.props.items.order.createdAt,["Bestellung",this.props.items.order.createdAt]);
    }
    
    //PRINT
    if ("printStartingTime" in this.props.items.state){
        this.test.set(this.props.items.state.printStartingTime,["Print",this.props.items.state.printStartingTime,this.props.items.state.printCompletionTime]);
    }
    
    //CONTROL
    this.props.items.state.controlProcesses.forEach(function(entry) {
        this.test.set(entry.controlStartingTime,["Control",entry.controlStartingTime,entry.function,entry.color,entry.shape,entry.controlCompletionTime] );
    },this);
    
    //STORAGE
    this.props.items.state.storageProcesses.forEach(function(entry) {
        this.test.set(entry.storageStartingTime,["Storage",entry.storageStartingTime,entry.storageCompletionTime] );
        if (entry.outsourceStartingTime != null){
            this.test.set(entry.outsourceStartingTime,["Outsource",entry.outsourceStartingTime,entry.outsourceCompletionTime] );
        }
    },this);
    
    //ABHOLSTATION
    if (this.props.items.state.id === 9){
        this.test.set(this.props.items.updatedAt,["Abholstation",this.props.items.updatedAt]);
    }

    //WARTEN AUF DRUCK
    if (this.props.items.state.id === 0){
        this.test.set(this.props.items.createdAt,["Warteschlange",this.props.items.createdAt]);
    }

    var mapAsc = new Map([...this.test.entries()].sort());
    var items = []

    mapAsc.forEach(function(value,key) {
        var icon = "fa fa-globe"
        var title
        var description
        var start_time
        var start_date

        if (value[0] === "Print"){
            icon = "fa fa-print"
            title = "Druck des Werkstücks"
            var starttime = new Date(value[1])
            start_time = starttime.toLocaleTimeString();
            start_date = starttime.toLocaleDateString();
            description = "Es wurde mit dem Druck ihres Werkstücks gestartet. Ein 3D-Drucker fertigt in diesem Moment ihr Werkstück an"
        }
        else if (value[0] === "Control"){
            icon = "fa fa-check-square"
            title = "Kontrolle des Werkstücks"
            starttime = new Date(value[1])
            start_time = starttime.toLocaleTimeString();
            start_date = starttime.toLocaleDateString();
            if(value[2] === true && value[3] === true && value[4] === true && value[5] !== null){
                description = "Die Überprüfung des Werkstücks war erfolgreich. Es wurden keine Fehler gefunden."
            }else if((value[2] === false || value[3] === false || value[4] === false) && value[5] !== null ){
                description = "Die Überprüfung des Werkstücks war nicht erfolgreich. Ein Fehler ist in der Produktion aufgetreten."
                icon = "fa fa-times"
            }else{
                description = "Es wurde mit der Überprüfung des Werkstücks begonnen. Alle Eigenschaften und Funktionen werden überprüft."
                icon = "fa fa-search"
            }
            
        }
        else if (value[0] === "Storage"){
            icon = "fa fa-save"
            title = "Einlagerung des Werkstücks"
            starttime = new Date(value[1])
            start_time = starttime.toLocaleTimeString();
            start_date = starttime.toLocaleDateString();
            description = "Standortaktualisierung: Das Werkstück wurde in das Lager gebracht und wartet auf weitere Anweisungen."
        }
        else if (value[0] === "Outsource"){
            icon = "fa fa-save"
            title = "Auslagerung des Werkstücks"
            starttime = new Date(value[1])
            start_time = starttime.toLocaleTimeString();
            start_date = starttime.toLocaleDateString();
            description = "Standortaktualisierung: Das Werkstück wurde aus dem Lager geholt für weitere Kontrollen/Abholung."
        }
        else if (value[0] === "Bestellung"){
            icon = "fa fa-shopping-cart"
            title = "Bestellungseingang"
            starttime = new Date(value[1])
            start_time = starttime.toLocaleTimeString();
            start_date = starttime.toLocaleDateString();
            description = "Ihre Bestellung wurde erfolgreich erstellt und registriert. Die Bearbeitung ihrer Bestellung startet in Kürze"
        }
        else if (value[0] === "Abholstation"){
            icon = "fa fa-dot-circle-o iconcolor"
            title = "Liegt in der Abholstation bereit"
            starttime = new Date(value[1])
            start_time = starttime.toLocaleTimeString();
            start_date = starttime.toLocaleDateString();
            description = "Standortaktualisierung: Das Werkstück liegt für Sie in der Abholstation bereit."
        }
        else if (value[0] === "Warteschlange"){
            icon = "fa fa-pause"
            title = "Produktions-Warteschlange"
            starttime = new Date(value[1])
            start_time = starttime.toLocaleTimeString();
            start_date = starttime.toLocaleDateString();
            description = "Das Werkstück wurde angelegt und in der Produktions-Warteschlange platziert."
        }

        items.push({"icon":icon,"date":start_date,"time":start_time,"title":title,"description":description})
    });

    var linkMap = "/admin/map?id=" + this.props.items._id

    var main = (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-8 d-flex justify-content-center mb-5">
                    <div className="image">
                        {this.preview}
                    </div>
                </div>
            </div>  
            <div className="main-timeline9 mx-3">
                <div className="timeline">
                    <div className="timeline-content">
                        <div className="circle"><span><i className="fa fa-key"></i></span></div>
                        <div className="content">
                            <span className="year"><span>Information</span></span>
                            <h4 className="title">Abfrage des aktuellen Stands</h4>
                            <p className="description">
                                Verwenden Sie folgenden Key um den aktuellen Status abzufragen: {" " + this.props.items._id}
                            </p>
                            <div className="icon"><span></span></div>
                        </div>
                    </div>
                </div>
                <div className="timeline">
                    <div className="timeline-content">
                        <div className="circle"><span><i className="fa fa-map"></i></span></div>
                        <div className="content">
                            <span className="year"><span>Information</span></span>
                            <h4 className="title">Aktuelle Position</h4>
                            <p className="description">
                                <span>Überprüfen Sie die aktuelle Position auf der Karte:</span> 
                                <Link className="ml-2" to={linkMap}>Verlinkung zur Karte</Link>
                            </p>
                            <div className="icon"><span></span></div>
                        </div>
                    </div>
                </div>
                {items.map((node) => {
                    return <StatusNode data={node} key={node.time} />;
                })}
            </div>
        </div>   
    )
        
    return(main)
  }
} 